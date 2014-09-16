/**
 *
 * Creates a new SubscriptionService. Generally you should never create a PAYMILL service on your own. Instead use the exported "subscriptions".
 * @class SubscriptionService
 */
function SubscriptionService() {

}

SubscriptionService.prototype = new PaymillService();
SubscriptionService.prototype.constructor = SubscriptionService;
SubscriptionService.prototype.getPaymillObject = function() {
	return Subscription;
};
SubscriptionService.prototype.getEndpointPath = function() {
	return "/subscriptions";
};

/**
 * Create a subscription with payment and offer. Chain further values by calling with..() functions and finish by calling create().
 *
 * @param {(string|Offer)} offer an offer object or its id.
 * @param {(string|Payment)} payment a payment object or its id.
 * @return {SubscriptionService.Creator} a creator. when configured please call create()
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.fromOffer = function(payment,offer) {
    var creator = new SubscriptionService.Creator(this);
    creator.payment = payment;
    creator.offer = offer;
    return creator;
};

SubscriptionService.prototype.fromParams = function(payment, amount, currency, interval) {
    var creator = new SubscriptionService.Creator(this);
    creator.payment = payment;
    creator.amount = amount;
    creator.currency = currency;
    creator.interval = interval;
    return creator;
};

/**
 * This function creates a Subscription between a Client and an Offer. A Client can have several Subscriptions to different Offers, but only one Subscription to the same Offer. The Clients is charged for each billing interval entered.
 * <strong>NOTE</strong>As the Subscription create method has a lot of options, we recommend you to use a Subscription.Creator.
 * @param {(string|Offer)} offer an offer object or its id.
 * @param {(string|Payment)} payment a payment object or its id.
 * @param {(string|Client)} client the identifier of a client or a client. If not provided the client from the payment is being used.
 * @param {(string|number|Date)} start_at Unix-Timestamp for the subscription start date, if trial_end > start_at, the trial_end will be set to start_at
 * @param {(string|number)} amount the amount of the subscription in cents
 * @param {(string)} currency ISO 4217 formatted currency code startAt
 * @param {(string|Interval)} interval define how often the client should be charged.
 * @param {(string|Interval)} periodOfValidity limits the validity of the subscription
 * @param {(string)} name name of the subscription
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.createWithAll = function(payment, client, offer, amount, currency, interval, startAt,
    name,periodOfValidity, cb) {
	try {
		var map = {};
        map.payment = getIdFromObject(payment, Payment);
        if (!__.isEmpty(client)) {
            map.client = getIdFromObject(client, Client);
        }
        if (!__.isEmpty(offer)) {
            map.offer = getIdFromObject(offer, Offer);
        }
        if (__.isNumber(amount)) {
            map.amount = amount;
        }
        if (!__.isEmpty(currency)) {
            map.currency = currency;
        }
        if (!__.isEmpty(interval)) {
            map.interval = interval.toString();
        }
        if (startAt) {
            map.start_at = getUnixTimeFromParam(startAt,"startAt");
        }
        if (!__.isEmpty(name)) {
            map.name = name;
        }
        if (!__.isEmpty(periodOfValidity)) {
            map.period_of_validity = periodOfValidity.toString();
        }
		return this._create(map, Subscription, cb);
	} catch (e) {
		return this._reject(e);
	}
};

/**
 * List Subscriptions.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Subscription.Filter|null)} [filter] a list filter or null.
 * @param {(Subscription.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Subscription. f you set the attribute cancel_at_period_end parameter to the value true, the subscription will remain active until the end of the period. The subscription will not be renewed again. If the value is set to false it is directly terminated but pending transactions will still be charged.
 * @param {Subscription} obj a Subscription object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Temporary pauses a subscription. <br />
 * <strong>NOTE</strong><br />
 * Pausing is permitted until one day (24 hours) before the next charge date.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.pause = function(obj, cb) {
    var map = { "pause" : true };
	return this._updateWithMap(obj, map, cb);
};

/**
 * Unpauses a subscription. Next charge will occur according to the defined interval.<br />
 * <strong>NOTE</strong><br />
 * if the nextCaptureAt is the date of reactivation: a charge will happen<br />
 * if the next_capture_at is in the past: it will be set to: reactivationdate + interval <br/>
 * <br />
 * <strong>IMPORTANT</strong><br />
 * An inactive subscription can reactivated within 13 month from the date of pausing. After this period, the subscription will
 * expire and cannot be re-activated.<br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.unpause = function(obj, cb) {
    var map = { "pause" : true };
    return this._updateWithMap(obj, map, cb);
};

/**
 * Changes the amount of a subscription. The new amount is valid until the end of the subscription. If you want to set a
 * temporary one-time amount use changeAmountTemporary().
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number)} amount the new amount.
 * @param {(string)} [currency] optionally, a new currency.
 * @param {(string|Interval)} [interval] optionally, a new interval.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeAmount = function(obj, amount, currency, interval, cb) {
    return this._changeAmount(obj, amount, 1, currency, interval, cb);
};

/**
 * Changes the amount of a subscription. The new amount is valid one-time only after which the original subscription amount will
 * be charged again. If you want to permanently change the amount use changeAmount()
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number)} amount the new amount.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeAmountTemporary = function(obj, amount, cb) {
    return this._changeAmount(obj, amount, 0, false, false, cb);
};

SubscriptionService.prototype._changeAmount = function(obj, amount, type, currency, interval, cb) {
    var map = {
        "amount_change_type" : type
    };
    validateNumber(amount,"amount",false);
    map.amount = amount;
    if (currency) {
        validateString(currency,"currency",true);
        map.currency = currency;
    }
    if (interval) {
        map.interval = interval.toString();
    }
    return this._updateWithMap(obj, map, cb);
};
/**
 * Change the offer of a subscription. <br />
 * The plan will be changed immediately. The next_capture_at will change to the current date (immediately). A refund will be
 * given if due. <br />
 * If the new amount is higher than the old one, a pro-rata charge will occur. The next charge date is immediate i.e. the
 * current date. If the new amount is less then the old one, a pro-rata refund will occur. The next charge date is immediate
 * i.e. the current date. <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferChangeCaptureDateAndRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 2);
};

/**
 * Change the offer of a subscription. <br />
 * The plan will be changed immediately. The next_capture_at will change to the current date (immediately). A refund will be
 * given if due. <br />
 * If the new amount is higher than the old one, a pro-rata charge will occur. The next charge date is immediate i.e. the
 * current date. If the new amount is less then the old one, a pro-rata refund will occur. The next charge date is immediate
 * i.e. the current date. <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferKeepCaptureDateAndRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 1);
};

/**
 * Change the offer of a subscription. <br />
 * the plan will be changed immediately. The next_capture_at date will remain unchanged. No refund will be given <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferKeepCaptureDateNoRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 0);
};


SubscriptionService.prototype._changeOffer = function(obj, offer, type, cb) {
    var map = {
        "offer_change_type" : type
    };
    map.offer = getIdFromObject(offer, Offer);
    return this._updateWithMap(obj, map, cb);
};

/**
 * Stop the trial period of a subscription and charge immediately.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.endTrial = function(obj, cb) {
    var map = {
        "trial_end" : false
    };
    return this._updateWithMap(obj, map, cb);
};

/**
 * Stop the trial period of a subscription on a specific date.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number|Date)} date the date, on which the subscription should end.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.endTrialAt = function(obj, date, cb) {
    var map = {};
    try {
        map.trial_end = getUnixTimeFromParam(date,"date");
        return this._updateWithMap(obj, map, cb);
    } catch (e) {
        return this._reject(e);
    }

};

/**
 * Change the period of validity for a subscription.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Interval)} newValidity the new validity.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.limitValidity = function(obj, newValidity, cb) {
    var map = {};
    try {
        if (__.isEmpty(newValidity)) {
            throw new PMError(PMError.Type.WRONG_PARAMS, "newValidity must be a an interval");
        }
        map.period_of_validity = newValidity.toString();
        return this._updateWithMap(obj, map, cb);
    } catch (e) {
        return this._reject(e);
    }

};

/**
 * Change the validity of a subscription to unlimited
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.unlimitValidity = function(obj, cb) {
    var map = {
        "period_of_validity" : "remove"
    };
    return this._updateWithMap(obj, map, cb);
};


/**
 * This function removes an existing subscription. The subscription will be deleted and no pending transactions will be charged.
 * Deleted subscriptions will not be displayed.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.delete = function(obj, cb) {
    var map = { "remove" : true };
    return this._removeWithMap(obj, map, cb);
};

/**
 * This function cancels an existing subscription. The subscription will be directly terminated and no pending transactions will
 * be charged.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.cancel = function(obj, cb) {
    var map = { "remove" : false };
    return this._removeWithMap(obj, map, cb);
};


/**
 * Get a Subscription.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.detail = function(obj, cb) {
    return this._detail(obj, cb);
};

/**
 * Updates a subscription.Following fields will be updated:<br />
 * <p>
 * <ul>
 * <li>interval (note, that nextCaptureAt will not change.)
 * <li>currency
 * <li>name
 * <ul>
 * <p>
 * To update further properties of a subscription use following methods:<br />
 * <p>
 * <ul>
 * <li>cancel() to cancel.
 * <li>changeAmount() to change the amount.
 * <li>changeOfferChangeCaptureDateAndRefund() to change the offer.
 * <li>changeOfferKeepCaptureDateAndRefund() to change the offer.
 * <li>changeOfferKeepCaptureDateNoRefund() to change the offer.
 * <li>endTrial() to end the trial
 * <li>limitValidity() to change the validity.
 * <li>pause() to pause
 * <li>unlimitValidity() to change the validity.
 * <li>unpause() to unpause.
 * <ul>
 * <p>
 * @param {Subscription} obj a Subscription object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};

/**
 * A helper for the complex creation method
 * @class SubscriptionService.Creator
 * @memberof SubscriptionService
 */
SubscriptionService.Creator = function(service) {
    this.service = service;
};

SubscriptionService.Creator.prototype.service = null;
SubscriptionService.Creator.prototype.payment = null;
SubscriptionService.Creator.prototype.client = null;
SubscriptionService.Creator.prototype.offer = null;
SubscriptionService.Creator.prototype.amount = null;
SubscriptionService.Creator.prototype.currency = null;
SubscriptionService.Creator.prototype.interval = null;
SubscriptionService.Creator.prototype.startAt = null;
SubscriptionService.Creator.prototype.name = null;
SubscriptionService.Creator.prototype.periodOfValidity = null;

SubscriptionService.Creator.prototype.create = function(cb) {
 return this.service.createWithAll(this.payment,this.client,this.offer,this.amount,this.currency,this.interval,this.startAt,this.name,this.periodOfValidity,cb);
};

SubscriptionService.Creator.prototype.withAmount = function(amount) {
    this.amount = amount;
    return this;
};

SubscriptionService.Creator.prototype.withClient = function(client) {
    this.client = client;
    return this;
};

SubscriptionService.Creator.prototype.withCurrency = function(currency) {
    this.currency = currency;
    return this;
};

SubscriptionService.Creator.prototype.withInterval = function(interval) {
    this.interval = interval;
    return this;
};

SubscriptionService.Creator.prototype.withName = function(name) {
    this.name = name;
    return this;
};

SubscriptionService.Creator.prototype.withOffer = function(offer) {
    this.offer = offer;
    return this;
};

SubscriptionService.Creator.prototype.withPeriodOfValidity = function(periodOfValidity) {
    this.periodOfValidity = periodOfValidity;
    return this;
};

SubscriptionService.Creator.prototype.withStartDate = function(startAt) {
    this.startAt = startAt;
    return this;
};
