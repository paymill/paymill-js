/**
 *
 * Creates a new Preauthorization. Generally you should never create a PAYMILL object on your own.
 * @class Preauthorization
 * @classdesc If you'd like to reserve some money from the client's credit card but you'd also like to execute the transaction itself a bit later, then use preauthorizations. This is NOT possible with direct debit. <br/>A preauthorization is valid for 7 days.
 */
function Preauthorization() {

}

Preauthorization.prototype = new PaymillObject();
Preauthorization.prototype.constructor = Preauthorization;

/**
 * Unique identifier for this payment.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.id = null;

/**
 * Formatted amount which will be reserved for further transactions.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.amount = null;

/**
 * ISO 4217 formatted currency code.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.currency = null;

/**
 * Additional description for this preauthorization.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.description = null;

/**
 * Indicates the current status of this preauthorization.
 * @type {Preauthorization.Status}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.status = null;

/**
 * Whether this preauthorization was issued while being in live mode or not.
 * @type {boolean}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.livemode = null;

/**
 * Corresponding payment object.
 * @type {Payment}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.payment = null;

/**
 * Corresponding client object.
 * @type {Client}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.client = null;

/**
 * Corresponding Transaction object.
 * @type {Transaction}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.transaction = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.app_id = null;
/**
 * Status of a Preauthorization.
 * @memberof Preauthorization
 * @property {string} OPEN
 * @property {string} PENDING
 * @property {string} CLOSED
 * @property {string} FAILED
 * @property {string} DELETED
 * @property {string} PREAUTH
 */
Preauthorization.Status = {
	OPEN : "open",
	PENDING : "pending",
	CLOSED : "closed",
	FAILED : "failed",
	DELETED : "deleted",
	PREAUTH : "preauth"
};

/*
 * special fields
 */
Preauthorization.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		payment : function(json) {
			return deserializePaymillObject(json, Payment);
		},
		client : function(json) {
			return deserializePaymillObject(json, Client);
		}
	};
};
/**
 * Specify an order for preauthorizations.
 * @class Preauthorization.Order
 * @memberof Preauthorization
 * @extends Order
 */
Preauthorization.Order = function() {
	Order.call(this);
};
Preauthorization.Order.prototype = new Order();
Preauthorization.Order.constructor = Preauthorization.Order;

/**
 * @returns {Order} order by created_at
 * @memberof Client.Order
 */
Preauthorization.Order.created_at = function() {
	var order = new Client.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for preauthorizations.
 * @class Preauthorization.Filter
 * @memberof Preauthorization
 * @extends Filter
 */
Preauthorization.Filter = function() {
	Filter.call(this);
};
Preauthorization.Filter.prototype = new Filter();
Preauthorization.Filter.constructor = Preauthorization.Filter;

/**
 * Add filtering by payment
 * @param {(string|Client)} client the client object or its id.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.client = function(client) {
	this.client = getIdFromObject(client);
	return this;
};
/**
 * Add filtering by payment
 * @param {(string|Payment)} payment the payment object or its id.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.payment = function(payment) {
	this.payment = getIdFromObject(payment);
	return this;
};
/**
 * Add filtering by amount. e.g. "300” or ">300" or "<300"
 * @param {(string|number)} amount the target amount
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * The {@link Preauthorization} object.
 */
exports.Preauthorization = Preauthorization;
