/**
 *
 * Creates a new Subscription. Generally you should never create a PAYMILL object on your own.
 * @class Subscription
 * @extends PaymillObject
 * @classdesc Subscriptions allow you to charge recurring payments on a client's credit card / to a client's direct debit. A subscription connects a client to the offers-object. A client can have several subscriptions to different offers, but only one subscription to the same offer.
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
 * The amount of the subscription in cents
 * @type {number}
 * @memberof Subscription.prototype
 */
Subscription.prototype.amount = null;

/**
 * A one-time amount in cents, will charge once only
 * @type {number}
 * @memberof Subscription.prototype
 */
Subscription.prototype.temp_amount = null;

/**
 * ISO 4217 formatted currency code
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.currency = null;

/**
 * Name of the subscription
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.name = null;

/**
 * Defining how often the client should be charged
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.interval = null;

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
 * Limit the validity of the subscription.
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.period_of_validity = null;

/**
 * Expiring date of the subscription.
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.end_of_period = null;

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

/**
 * Subscription is marked as canceled or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.is_canceled = null;

/**
 * Subscription is marked as deleted or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.is_deleted = null;

/**
 * Shows, if subscription is "active", "inactive", "expired" or "failed"
 * @type {string|Subscription.Status}
 * @memberof Subscription.prototype
 */
Subscription.prototype.status = null;

/**
 * Status of a subscription.
 * @memberof Subscription
 * @property {string} ACTIVE
 * @property {string} INACTIVE
 * @property {string} EXPIRED
 * @property {string} FAILED
 */
Subscription.Status = {
    ACTIVE : "active" ,
    INACTIVE : "inactive",
    EXPIRED : "expired" ,
    FAILED : "failed"
};
/*
 * special fields
 */
Subscription.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		trial_start : deserializeDate,
		trial_end : deserializeDate,
        end_of_period : deserializeDate,
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
		},
        interval : function(json) {
            return deserializePaymillObject(json, Interval);
        },
        period_of_validity : function(json) {
            return deserializePaymillObject(json, Interval);
        }
	};
};

Subscription.prototype.getUpdateableFields = function() {
	return [ 'currency', 'name', 'interval', 'payment' ];
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
	this.created_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Subscription} object.
 */
exports.Subscription = Subscription;
