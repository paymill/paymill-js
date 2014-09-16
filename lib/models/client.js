/**
 *
 * Creates a new Client. Generally you should never create a PAYMILL object on your own.
 * @class Client
 * @extends PaymillObject
 * @classdesc The clients object is used to edit, delete, update clients as well as to permit refunds, subscriptions, insert credit card details for a client, edit client details and of course make transactions. Clients can be created individually by you or they will be automatically generated with the transaction if there is no client ID transmitted.
 */
function Client() {

}

Client.prototype = new PaymillObject();
Client.prototype.constructor = Client;
/**
 * Unique identifier of this preauthorization
 * @type {string}
 * @memberof Client.prototype
 */

Client.prototype.id = null;
/**
 * Mail address of this client.
 * @type {string}
 * @memberof Client.prototype
 */
Client.prototype.email = null;
/**
 * Additional description for this client, perhaps the identifier from your CRM system?
 * @type {string}
 * @memberof Client.prototype
 */
Client.prototype.description = null;
/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Client.prototype
 */
Client.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Client.prototype
 */
Client.prototype.updated_at = null;
/**
 * List of payments.
 * @type {Array.<Payment>}
 * @memberof Client.prototype
 */
Client.prototype.payment = null;
/**
 * List of subscriptions.
 * @type {Array.<Subscription>}
 * @memberof Client.prototype
 */
Client.prototype.subscription = null;
/**
 * App (ID) that created this client or null if created by yourself.
 * @type {string}
 * @memberof Client.prototype
 */
Client.prototype.app_id = null;
/*
 * special fields
 */
Client.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		payment : function(json) {
			return deserializePaymillObjectList(json, Payment);
		},
		subscription : function(json) {
			return deserializePaymillObjectList(json, Subscription);
		}
	};
};

Client.prototype.getUpdateableFields = function() {
	return ["email", "description"];
};
/**
 * Specify an order for clients.
 * @class Client.Order
 * @memberof Client
 * @extends Order
 */
Client.Order = function() {
	Order.call(this);
};
Client.Order.prototype = new Order();
Client.Order.constructor = Client.Order;


/**
 * @returns {Order} order by creditcard
 * @memberof Client.Order
 */
Client.Order.creditcard = function() {
	var order = new Client.Order();
	order.type = "creditcard";
	return order;
};

/**
 * @returns {Order} order by email
 * @memberof Client.Order
 */
Client.Order.email = function() {
	var order = new Client.Order();
	order.type = "email";
	return order;
};

/**
 * @returns {Order} order by created_at
 * @memberof Client.Order
 */
Client.Order.created_at = function() {
	var order = new Client.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for clients.
 * @class Client.Filter
 * @memberof Client
 * @extends Filter
 */
Client.Filter = function() {
	Filter.call(this);
};
Client.Filter.prototype = new Filter();
Client.Filter.constructor = Client.Filter;

/**
 * Add filtering by payment
 * @param {(string|Payment)} payment the payment object or its id.
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.payment = function(payment) {
	this.payment = getIdFromObject(payment);
	return this;
};
/**
 * Add filtering by subscription
 * @param {(string|Subscription)} subscription the subscription object or its id.
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.subscription = function(subscription) {
	this.subscription = getIdFromObject(subscription);
	return this;
};

/**
 * Add filtering by offer
 * @param {(string|Offer)} offer the offer object or its id.
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.offer = function(offer) {
	this.offer = getIdFromObject(offer);
	return this;
};
/**
 * Add filtering by description
 * @param {string} description the description
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.description = function(description) {
	this.description = description;
	return this;
};
/**
 * Add filtering by email
 * @param {string} email the email
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.email = function(email) {
	this.email = email;
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * Add filtering by updated_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Client.Filter
 */
Client.Filter.prototype.updated_at = function(from, to) {
	this.updated_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Client} object.
 */
exports.Client = Client;
