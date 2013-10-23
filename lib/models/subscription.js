/**
 *
 * Creates a new Subscription. Generally you should never create a PAYMILL object on your own.
 * @class Subscription
 * @extends PaymillObject
 * @classdesc Subscriptions allow you to charge recurring payments on a client’s credit card / to a client’s direct debit. A subscription connects a client to the offers-object. A client can have several subscriptions to different offers, but only one subscription to the same offer.
 */
function Subscription() {

}

Subscription.prototype = new PaymillObject();
Subscription.prototype.constructor = Subscription;
/**
 * Unique identifier of this subscription.
 * @type {string}
 * @memberof Subscription.prototype
 */

Subscription.prototype.id = null;
/**
 * Corresponding offer.
 * @type {Offer}
 * @memberof Subscription.prototype
 */
Subscription.prototype.offer = null;
/**
 * Whether this subscription was issued while being in live mode or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.livemode = null;

/**
 * Cancel this subscription immediately or at the end of the current period?
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.cancel_at_period_end = null;

/**
 * Unix-Timestamp for the trial period start
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.trial_start = null;
/**
 * Unix-Timestamp for the trial period end.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.trial_end = null;
/**
 * Unix-Timestamp for the next charge.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.next_capture_at = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.updated_at = null;
/**
 * Unix-Timestamp for the cancel date.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.canceled_at = null;

/**
 * Corresponding payment.
 * @type {Payment}
 * @memberof Subscription.prototype
 */
Subscription.prototype.payment = null;
/**
 * Corresponding client.
 * @type {Client}
 * @memberof Subscription.prototype
 */
Subscription.prototype.client = null;

/**
 * App (ID) that created this subscription or null if created by yourself.
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.app_id = null;

/*
 * special fields
 */
Subscription.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		trial_start : deserializeDate,
		trial_end : deserializeDate,
		next_capture_at : deserializeDate,
		canceled_at : deserializeDate,
		offer : function(json) {
			return deserializePaymillObject(json, Offer);
		},
		payment : function(json) {
			return deserializePaymillObject(json, Payment);
		},
		client : function(json) {
			return deserializePaymillObject(json, Client);
		}
	};
};

Subscription.prototype.getUpdateableFields = function() {
	return ["cancel_at_period_end", "offer", "payment"];
};

/**
 * Specify an order for clients.
 * @class Subscription.Order
 * @memberof Subscription
 * @extends Order
 */
Subscription.Order = function() {
	Order.call(this);
};
Subscription.Order.prototype = new Order();
Subscription.Order.constructor = Subscription.Order;

/**
 * @returns {Order} order by offer
 * @memberof Subscription.Order
 */
Subscription.Order.offer = function() {
	var order = new Subscription.Order();
	order.type = "offer";
	return order;
};
/**
 * @returns {Order} order by canceled_at
 * @memberof Subscription.Order
 */
Subscription.Order.canceled_at = function() {
	var order = new Subscription.Order();
	order.type = "canceled_at";
	return order;
};
/**
 * @returns {Order} order by created_at
 * @memberof Subscription.Order
 */
Subscription.Order.created_at = function() {
	var order = new Subscription.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for subscriptions.
 * @class Subscription.Filter
 * @memberof Subscription
 * @extends Filter
 */

Subscription.Filter = function() {
	Filter.call(this);
};
Subscription.Filter.prototype = new Filter();
Subscription.Filter.constructor = Subscription.Filter;

/**
 * Add filtering by offer
 * @param {(string|Offer)} offer the offer object or its id.
 * @returns {Filter} the same filter.
 * @memberof Subscription.Filter
 */
Subscription.Filter.prototype.offer = function(offer) {
	this.offer = getIdFromObject(offer);
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Subscription.Filter
 */
Subscription.Filter.prototype.created_at = function(from, to) {
	var realFrom = getTimeFromObject(from);
	var realTo = getTimeFromObject(to);
	this.created_at = realFrom + "-" + realTo;
	return this;
};

/**
 * The {@link Subscription} object.
 */
exports.Subscription = Subscription; 