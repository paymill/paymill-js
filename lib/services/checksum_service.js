/**
 *
 * Creates a new ChecksumService. Generally you should never create a PAYMILL service on your own. Instead use the exported "transactions".
 * @class ChecksumService
 */
function ChecksumService() {

}

ChecksumService.prototype = new PaymillService();
ChecksumService.prototype.constructor = ChecksumService;
ChecksumService.prototype.getPaymillObject = function() {
	return Checksum;
};
ChecksumService.prototype.getEndpointPath = function() {
	return "/checksums";
};

/**
 * Create a checksum
 * @param {string} checksum_type currently only 'paypal'
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} return_url URL to redirect customers to after checkout has completed.
 * @param {string} cancel_url URL to redirect customers to after they have canceled the checkout. As a result, there will be no transaction.
 * @param {(number|string)} fee_amount Fee included in the transaction amount (set by a connected app). Mandatory if fee_payment is set.
 * @param {string} fee_payment the identifier of the payment from which the fee will be charged (creditcard-object or directdebit-object). Mandatory if fee_amount is set.
 * @param {string} fee_currency ISO 4217 formatted currency code for the fee.
 * @param {ShoppingCartItem[]} items list of items.
 * @param {Address[]} shipping_address list of shipping addresses.
 * @param {Address[]} billing_address list of billing addresses.
 * @param {string} appId App (ID) that created this refund or null if created by yourself.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */

ChecksumService.prototype.create = function(checksum_type, amount, currency, return_url, cancel_url, fee_amount, fee_payment, fee_currency, description, items, shipping_address, billing_address, app_id, cb) {
	var map = {};
  validateString(checksum_type,"checksum_type",false);
	validateNumber(amount,"amount",false);
  validateString(currency,"currency",false);
  validateString(return_url,"return_url",false);
  validateString(cancel_url,"cancel_url",false);
	map.amount = amount;
	map.currency = currency;
	map.return_url = return_url;
	map.cancel_url = cancel_url;

	if (fee_amount) {
		map.fee_amount = fee_amount;
	}
	if (fee_payment) {
		map.fee_payment = fee_payment;
	}
	if (fee_currency) {
		map.fee_currency = fee_currency;
	}
	if (fee_currency) {
		map.fee_currency = fee_currency;
	}
	if (description) {
		map.description = description;
	}
	if (app_id) {
		map.app_id = app_id;
	}

	if (items) {
		validateList(items,'items', ShoppingCartItem, false);
		map.items = JSON.stringify(items);
	}

	if (shipping_address) {
		validateObject(shipping_address,'shipping_address', Address, false);
		map.shipping_address = shipping_address;
	}
	if (billing_address) {
		validateObject(billing_address,'billing_address', Address, false);
		map.billing_address = billing_address;
	}
	return this._create(map, Transaction, cb);
};

ChecksumService.prototype.createChecksumForPayPal = function(amount, currency, return_url, cancel_url, fee_amount, fee_payment, fee_currency, description, items, shipping_address, billing_address, app_id, cb) {
	return this._createChecksum('paypal', amount, currency, return_url, cancel_url, fee_amount, fee_payment, fee_currency, description, items, shipping, billing, app_id, cb);
};

/**
 * Create a checksum for PayPal. Chain further values by calling withXXX()
 * functions and finish by calling create().
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} return_url URL to redirect customers to after checkout has completed.
 * @param {string} cancel_url URL to redirect customers to after they have canceled the checkout. As a result, there will be no transaction.
 * @return {ChecksumService.Creator} a creator. when configured, please call create()
 * @memberOf ChecksumService
 */
ChecksumService.prototype.forPaypal = function(amount, currency, return_url, cancel_url) {
    var creator = new ChecksumService.Creator(this);
		validateNumber(amount,"amount",false);
	  validateString(currency,"currency",false);
	  validateString(return_url,"return_url",false);
	  validateString(cancel_url,"cancel_url",false);

		creator.map.checksum_type = 'paypal';
		creator.map.amount = amount;
		creator.map.currency = currency;
		creator.map.return_url = return_url;
		creator.map.cancel_url = cancel_url;

    return creator;
};

/**
 * A helper for the complex creation method
 * @class ChecksumService.Creator
 * @memberof ChecksumService
 */
ChecksumService.Creator = function(service) {
    this.service = service;
		this.map = {};
};

/**
 * Create a checksum with this creator.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.create = function(cb) {
	return this.service._create(this.map, Checksum, cb);
};

/**
 * Add a fee amount
 * @param {(string|Client)} fee_amount
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withFeeAmount = function(fee_amount) {
		validateNumber(fee_amount);
    this.map.fee_amount = fee_amount;
    return this;
};

/**
 * Add a fee payment
 * @param {(string|Client)} client
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withFeePayment = function(fee_payment) {
    this.map.fee_payment = getIdFromObject(fee_payment);
    return this;
};

/**
 * Add a fee currency
 * @param {string} fee_currency
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withFeeCurrency = function(fee_currency) {
    validateString(fee_currency,"fee_currency",false);
    this.map.fee_currency = fee_currency;
    return this;
};

/**
 * Add a description
 * @param {string} description
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withDescription = function(description) {
		validateString(description);
    this.map.description = description;
    return this;
};

/**
 * Add items
 * @param {string} mandate_reference
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withItems = function(items) {
		validateList(items,'items', ShoppingCartItem, true);
		this.map.items = JSON.stringify(items);
    return this;
};


/**
 * Add a billing adress
 * @param {string} billing_address
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withBillingAddress = function(billing_address) {
		validateObject(billing_address,'billing_address', Address, true);
		this.map.billing_address = billing_address;
    return this;
};

/**
 * Add a shipping adress
 * @param {string} shipping_address
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withShippingAddress = function(shipping_address) {
		validateObject(shipping_address,'shipping_address', Address, false);
		this.map.shipping_address = shipping_address;
    return this;
};

/**
 * Add a client id
 * @param {string} client_id
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withClientId = function(client_id) {
		validateString(client_id,'client_id', false);
		this.map.client = client_id;
	return this;
};

/**
 * Add a checksum action
 * @param {string} checksum_action
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withChecksumAction = function(checksum_action) {
		var possible_values = ['transaction', 'payment'];
		validateString(checksum_action,'checksum_action', false);
		if (__.indexOf(possible_values, checksum_action) === -1) {
			throw new PMError(PMError.Type.WRONG_PARAMS, 'checksum_action must be one of [' + possible_values.toString() + ']');
		}
		this.map.checksum_action = checksum_action;
	return this;
};

/**
 * Ask the buyer for a billing agreement and add a description
 * @param {boolean} require_reusable_payment
 * @param {string} reusable_payment_description
 * @return {ChecksumService.Creator} the same creator
 * @memberOf ChecksumService.Creator
 */
ChecksumService.Creator.prototype.withReusablePayment = function(require_reusable_payment, reusable_payment_description) {
		var descriptionMaxLength = 127;
		validateBoolean(require_reusable_payment,'require_reusable_payment', false);
		validateString(reusable_payment_description,'reusable_payment_description', true);
		if (reusable_payment_description && reusable_payment_description.length > descriptionMaxLength) {
			throw new PMError(PMError.Type.WRONG_PARAMS, 'Length of reusable_payment_description must be less than ' + descriptionMaxLength + ' characters');
		}
		this.map.require_reusable_payment = require_reusable_payment;
		this.map.reusable_payment_description = reusable_payment_description || null;
	return this;
};
