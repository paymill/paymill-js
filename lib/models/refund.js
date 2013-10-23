/**
 *
 * Creates a new Refund. Generally you should never create a PAYMILL object on your own.
 * @class Refund
 * @extends PaymillObject
 * @classdesc Refunds are own objects with own calls for existing transactions. The refunded amount will be credited to the account of the client.
 */
function Refund() {

}

Refund.prototype = new PaymillObject();
Refund.prototype.constructor = Refund;
/**
 * Unique identifier of this refund.
 * @type {string}
 * @memberof Client.prototype
 */

Refund.prototype.id = null;
/**
 * Corresponding transaction object.
 * @type {Transaction}
 * @memberof Refund.prototype
 */
Refund.prototype.transaction = null;

/**
 * The refunded amount.
 * @type {string}
 * @memberof Refund.prototype
 */
Refund.prototype.amount = null;

/**
 * Indicates the current status of this refund.
 * @type {Refund.Status}
 * @memberof Refund.prototype
 */
Refund.prototype.status = null;

/**
 * The description given for this refund.
 * @type {string}
 * @memberof Refund.prototype
 */
Refund.prototype.description = null;

/**
 * Whether this refund happend in test- or in livemode.
 * @type {boolean}
 * @memberof Refund.prototype
 */
Refund.prototype.livemode = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Refund.prototype
 */
Refund.prototype.created_at = null;

/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Refund.prototype
 */
Refund.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Refund.prototype
 */
Refund.prototype.app_id = null;

/**
 * A response code or null if details are called.
 * @type {number}
 * @memberof Refund.prototype
 */
Refund.prototype.response_code = null;

/**
 * Status of a Refund.
 * @memberof Refund
 * @property {string} OPEN
 * @property {string} PENDING
 * @property {string} REFUNDED
 */
Refund.Status = {
	OPEN : "open",
	PENDING : "pending",
	REFUNDED : "refunded",
};
Refund.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		transaction : function(json) {
			return deserializePaymillObject(json, Transaction);
		},
	};
};
/**
 * Specify an order for clients.
 * @class Refund.Order
 * @memberof Refund
 * @extends Order
 */
Refund.Order = function() {
	Order.call(this);
};
Refund.Order.prototype = new Order();
Refund.Order.constructor = Refund.Order;

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.transaction = function() {
	var order = new Refund.Order();
	order.type = "transaction";
	return order;
};

/**
 * @returns {Order} order by client
 * @memberof Refund.Order
 */
Refund.Order.client = function() {
	var order = new Refund.Order();
	order.type = "client";
	return order;
};

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.amount = function() {
	var order = new Refund.Order();
	order.type = "amount";
	return order;
};

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.created_at = function() {
	var order = new Refund.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for refunds.
 * @class Refund.Filter
 * @memberof Refund
 * @extends Filter
 */
Refund.Filter = function() {
	Filter.call(this);
};
Refund.Filter.prototype = new Filter();
Refund.Filter.constructor = Refund.Filter;

/**
 * Add filtering by client
 * @param {(string|Client)} client the client object or its id.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.client = function(client) {
	this.payment = getIdFromObject(client);
	return this;
};
/**
 * Add filtering by transaction
 * @param {(string|Transaction)} transaction the transaction object or its id.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.transaction = function(transaction) {
	this.transaction = getIdFromObject(transaction);
	return this;
};

/**
 * Add filtering by amount. e.g. “300” or “>300” or “<300”
 * @param {(string|number)} amount the target amount
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.amount = function(amount, equality) {
	var realEquality = equality;
	if (equality === undefined) {
		realEquality = Filter.EQUALITY.EQUAL;
	}
	this.amount = realEquality + amount;
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.created_at = function(from, to) {
	var realFrom = getTimeFromObject(from);
	var realTo = getTimeFromObject(to);
	this.created_at = realFrom + "-" + realTo;
	return this;
}; 


/**
 * The {@link Refund} object.
 */
exports.Refund = Refund;