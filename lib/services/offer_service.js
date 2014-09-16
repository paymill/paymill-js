/**
 *
 * Creates a new OfferService. Generally you should never create a PAYMILL service on your own. Instead use the exported "offers".
 * @class OfferService
 */
function OfferService() {

}

OfferService.prototype = new PaymillService();
OfferService.prototype.constructor = OfferService;
OfferService.prototype.getPaymillObject = function() {
	return Offer;
};
OfferService.prototype.getEndpointPath = function() {
	return "/offers";
};

/**
 * This function creates a Offer object.
 * @param {string|number} amount Amount (in cents).
 * @param {string} currency ISO 4217 formatted currency code
 * @param {string|Interval} interval Defining how often the client should be charged. Format: number DAY|WEEK|MONTH|YEAR Example: 2 DAY
 * @param {string} name Your name for this offer
 * @param {number} [trial_period_days] Give it a try or charge directly? Default is 0
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.create = function(amount, currency, interval, name, trial_period_days, cb) {
    try {
        validateNumber(amount,"amount",false);
        validateString(currency,"currency",false);
        validateString(name,"name",false);
        validateMandatory(interval,"interval");
        var map = {
            amount : amount,
            currency : currency,
            interval : interval.toString(),
            name : name
        };
        if (trial_period_days) {
            validateNumber(trial_period_days,"trial_period_days",false);
            map.trial_period_days = trial_period_days;
        }
        return this._create(map, Offer, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List Offers.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Offer.Filter|null)} [filter] a list filter or null.
 * @param {(Offer.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove an Offer.
 * @param {Offer} obj a Offer object or its id.
 * @param {boolean} removeWithSubscriptions if true, the plan and all subscriptions associated with it will be deleted. If false, only the plan will be deleted.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.remove = function(obj, removeWithSubscriptions, cb) {
    validateBoolean(removeWithSubscriptions,'removeWithSubscriptions',false);
    var map =  {
        "remove_with_subscriptions": removeWithSubscriptions
    };
    return this._removeWithMap(obj, map, cb);
};

/**
 * Get an Offer.
 * @param {(string|Offer)} obj a Offer object or its id. note, if you set a Offer object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

/**
 * Update an Offer.
 * @param {(string|Offer)} obj a Offer object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};
