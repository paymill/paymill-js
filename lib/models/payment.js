/**
 *
 * Creates a new payment. Generally you should never create a PAYMILL object on your own.
 * @class Payment
 * @classdesc The Payment object represents a payment with a credit card or via direct debit. It is used for several function calls (e.g. transactions, subscriptions, clients, ...). To be PCI compliant these information is encoded by our Paymill PSP. You only get in touch with safe data (token) and needn't to care about the security problematic of informations like credit card data.
 */
function Payment() {

}

Payment.prototype = new PaymillObject();
Payment.prototype.constructor = Payment;

/**
 * Unique identifier for this payment.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.id = null;

/**
 * The type of the payment.
 * @type {Payment.Type}
 * @memberof Payment.prototype
 */
Payment.prototype.type = null;

/**
 * The identifier of a client (client-object)
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.client = null;
/**
 * Card type eg. visa, mastercard. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.card_type = null;

/**
 * Country. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.country = null;

/**
 * Expiry month of the credit card. Only for credit card payments.
 * @type {number}
 * @memberof Payment.prototype
 */
Payment.prototype.expire_month = null;
/**
 * Expiry year of the credit card. Only for credit card payments.
 * @type {number}
 * @memberof Payment.prototype
 */
Payment.prototype.expire_year = null;
/**
 * The last four digits of the credit card. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.last4 = null;
/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Payment.prototype
 */
Payment.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Payment.prototype
 */
Payment.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.app_id = null;
/**
 * The used account number, for security reasons the number is masked. Only for direct debit payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.account = null;

/**
 * Whether or not this payment is recurring (can be used more than once).
 * @type {boolean}
 * @memberof Payment.prototype
 */
Payment.prototype.is_recurring = null;

/**
 * Whether or not this payment is usable for preauthorization.
 * @type {boolean}
 * @memberof Payment.prototype
 */
Payment.prototype.is_usable_for_preauthorization = null;

/**
 * Name of the account holder. Only for direct debit payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.holder = null;
/**
 * The type of payment.
 * @memberof Payment
 * @property {string} CREDITCARD a credit card payment.
 * @property {string} DEBIT a direct debit payment.
 */
Payment.Type = {
	CREDITCARD : "creditcard",
	DEBIT : "debit"
};
/*
 * special fields
 */
Payment.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate
	};
};

/**
 * Specify an order for payments.
 * @class Payment.Order
 * @memberof Payment
 * @extends Order
 */
Payment.Order = function() {
	Order.call(this);
};
Payment.Order.prototype = new Order();
Payment.Order.constructor = Payment.Order;

/**
 * @returns {Order} order by created_at
 * @memberof Payment.Order
 */
Payment.Order.created_at = function() {
	var order = new Payment.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for payments.
 * @class Payment.Filter
 * @memberof Payment
 * @extends Filter
 */
Payment.Filter = function() {
	Filter.call(this);
};
Payment.Filter.prototype = new Filter();
Payment.Filter.constructor = Payment.Filter;

/**
 * Add filtering by card_type
 * @param {string} card_type e.g. "visa", "mastercard" etc.
 * @returns {Filter} the same filter.
 * @memberof Payment.Filter
 */
Payment.Filter.prototype.card_type = function(card_type) {
	this.card_type = card_type;
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Payment.Filter
 */
Payment.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Payment} object.
 */
exports.Payment = Payment;
