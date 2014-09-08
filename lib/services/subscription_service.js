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
 * This function creates a subscription between a client and an offer. A client can have several subscriptions to different offers, but only one subscription to the same offer. The clients is charged for each billing interval entered.
 * @param {(string|Offer)} offer an offer object or its id.
 * @param {(string|Payment)} payment an offer object or its id.
 * @param {(string|Client)} client the identifier of a client or a client. If not provided the client from the payment is being used.
 * @param {(string|number|Date)} start_at Unix-Timestamp for the trial period start
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.create = function(offer, payment, client, start_at, cb) {
	try {
		var map = {};
		var offerId = getIdFromObject(offer, Offer);
		map.offer = offerId;
		var paymentId = getIdFromObject(payment, Payment);
		map.payment = paymentId;
		try {
			var clientId = getIdFromObject(client, Client);
			map.client = clientId;
		} catch (e) {
			// no client
		}
		if (start_at) {
			if ( start_at instanceof Date) {
				map.start_at = start_at.getTime();
			} else if (__.isNumber(start_at) || __.isString(start_at)) {
				map.start_at = start_at;
			} else {
				return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "start_at must be a Date, number or string"));
			}
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
 * Update a Subscription.
 * @param {Subscription} obj a Subscription object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};
