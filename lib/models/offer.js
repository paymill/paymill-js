/**
 *
 * Creates a new Offer. Generally you should never create a PAYMILL object on your own.
 * @class Offer
 * @extends PaymillObject
 * @classdesc An offer is a recurring plan which a user can subscribe to. You can create different offers with different plan attributes e.g. a monthly or a yearly based paid offer/plan.
 */
function Offer() {

}

Offer.prototype = new PaymillObject();
Offer.prototype.constructor = Offer;
/**
 * Unique identifier of this offer.
 * @type {string}
 * @memberof Offer.prototype
 */

Offer.prototype.id = null;
/**
 * Your name for this offer
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.name = null;

/**
 * Every interval the specified amount will be charged. Only integer values are allowed (e.g. 42.00 = 4200).
 * @type {number}
 * @memberof Offer.prototype
 */
Offer.prototype.amount = null;

/**
 * ISO 4217 formatted currency code
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.currency = null;

/**
 * Defining how often the client should be charged.
 * @type {Interval}
 * @memberof Offer.prototype
 */
Offer.prototype.interval = null;

/**
 * Give it a try or charge directly?.
 * @type {number}
 * @memberof Offer.prototype
 */
Offer.prototype.trial_period_days = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Offer.prototype
 */
Offer.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Offer.prototype
 */
Offer.prototype.updated_at = null;

/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof SubscriptionCount.prototype
 */
Offer.prototype.subscription_count = null;

/**
 * App (ID) that created this offer or null if created by yourself.
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.app_id = null;

/*
 * special fields
 */
Offer.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		interval : function(json) {
			return deserializePaymillObject(json, Interval);
		},
		subscription_count : function(json) {
			return deserializePaymillObject(json, SubscriptionCount);
		}
	};
};

Offer.prototype.getUpdateableFields = function() {
	return ["name"];
};

/**
 * Specify an order for clients.
 * @class Offer.Order
 * @memberof Offer
 * @extends Order
 */
Offer.Order = function() {
	Order.call(this);
};
Offer.Order.prototype = new Order();
Offer.Order.constructor = Offer.Order;

/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.interval = function() {
	var order = new Offer.Order();
	order.type = "interval";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.amount = function() {
	var order = new Offer.Order();
	order.type = "amount";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.created_at = function() {
	var order = new Offer.Order();
	order.type = "created_at";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.trial_period_days = function() {
	var order = new Offer.Order();
	order.type = "trial_period_days";
	return order;
};

/**
 * Specify a filter for offers.
 * @class Offer.Filter
 * @memberof Offer
 * @extends Filter
 */

Offer.Filter = function() {
	Filter.call(this);
};
Offer.Filter.prototype = new Filter();
Offer.Filter.constructor = Offer.Filter;

/**
 * Add filtering by name
 * @param {string} name the name of the offer.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.name = function(name) {
	this.name = name;
	return this;
};
/**
 * Add filtering by trial_period_days
 * @param {(string|number)} client the trial_period_days of the offer.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.trial_period_days = function(trial_period_days) {
	this.trial_period_days = trial_period_days;
	return this;
};
/**
 * Add filtering by amount. e.g. "300" or ">300" or "<300"
 * @param {(string|number)} amount the amount to be filtered
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * Add filtering by updated_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.updated_at = function(from, to) {
	this.updated_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Offer} object.
 */
exports.Offer = Offer;
