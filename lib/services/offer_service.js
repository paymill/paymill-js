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

	// validate
	if (!amount || !(__.isNumber(amount) || __.isString(amount))) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "amount must be a number or string"));
	}
	if (!currency || !__.isString(currency)) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "currency must be a string"));
	}
	if (!name || !(__.isNumber(amount) || __.isString(name))) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "name must be a string"));
	}
	if (!interval) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "interval is mandatory"));
	}
	var path = this.getEndpointPath();
	var map = {
		amount : amount,
		currency : currency,
		interval : interval.toString(),
		name : name
	};
	if (trial_period_days) {
		if (__.isNumber(trial_period_days) || !__.isString(amount)) {
			map.trial_period_days = trial_period_days;
		} else {
			return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "trial period must be a number"));
		}
	}
	return this._create(map, Offer, cb);
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
 * Remove a Offer.
 * @param {Offer} obj a Offer object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Offer.
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
