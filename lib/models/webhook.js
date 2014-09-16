/**
 *
 * Creates a new Webhook. Generally you should never create a PAYMILL object on your own.
 * @class Webhook
 * @extends PaymillObject
 * @classdesc With webhooks we give you the possibility to react automatically to certain events which happen within our system. A webhook is basically a URL where we send an HTTP POST request to, every time one of the events attached to that webhook is triggered. Alternatively you can define an email address where we send the event’s information to You can manage your webhooks via the API as explained below or you can use the web interface inside our cockpit.<br/>Our call to the webhook / email includes a JSON encoded event object with detailed information about the event in it’s POST body.
 */
function Webhook() {

}

Webhook.prototype = new PaymillObject();
Webhook.prototype.constructor = Webhook;
/**
 * Unique identifier of this webhook
 * @type {string}
 * @memberof Webhook.prototype
 */

Webhook.prototype.id = null;
/**
 * The url of the webhook. Either the email OR the url have to be set and will be returned
 * @type {string}
 * @memberof Webhook.prototype
 */
Webhook.prototype.url = null;
/**
 * The email of the webhook. Either the email OR the url have to be set and will be returned
 * @type {string}
 * @memberof Webhook.prototype
 */
Webhook.prototype.email = null;
/**
 * you can create webhooks for livemode and testmode.
 * @type {boolean}
 * @memberof Webhook.prototype
 */
Webhook.prototype.livemode = null;

/**
 * Event types.
 * @type {Array.<Webhook.EventType>}
 * @memberof Webhook.prototype
 */
Webhook.prototype.event_types = null;

/**
 * App (ID) that created this webhook or null if created by yourself.
 * @type {string}
 * @memberof Webhook.prototype
 */
Webhook.prototype.app_id = null;

/**
 * An event type for a webhook.
 * @memberof Webhook
 * @property {string} CHARGEBACK_EXECUTED returns a transaction-object with state set to chargeback
 * @property {string} TRANSACTION_CREATED returns a transaction-object
 * @property {string} TRANSACTION_SUCCEDED returns a transaction-object
 * @property {string} TRANSACTION_FAILED returns a transaction-object
 * @property {string} SUBSCRIPTION_CREATED returns a subscription-object
 * @property {string} SUBSCRIPTION_UPDATED returns a subscription-object
 * @property {string} SUBSCRIPTION_DELETED returns a subscription-object
 * @property {string} SUBSCRIPTION_SUCCEEDED returns a subscription-object
 * @property {string} SUBSCRIPTION_FAILED returns a subscription-object
 * @property {string} REFUND_CREATED returns a refund-object
 * @property {string} REFUND_SUCCEEDED returns a refund-object
 * @property {string} REFUND_FAILED returns a refund-object
 * @property {string} PAYOUT_TRANSFERRED returns an invoice-object with the payout sum for the invoice period
 * @property {string} INVOICE_AVAILABLE returns an invoice-object with the fees sum for the invoice period
 * @property {string} APP_MERCHANT_ACTIVATED returns a merchant-object if a connected merchant was activated
 * @property {string} APP_MERCHANT_DEACTIVATED  returns a merchant-object if a connected merchant was deactivated
 * @property {string} APP_MERCHANT_REJECTED returns a merchant-object if a connected merchant was rejected
 */
Webhook.EventType = {
	CHARGEBACK_EXECUTED : "chargeback.executed",
	TRANSACTION_CREATED : "transaction.created",
	TRANSACTION_SUCCEDED : "transaction.succeeded",
	TRANSACTION_FAILED : "transaction.failed",
	SUBSCRIPTION_CREATED : "subscription.created",
	SUBSCRIPTION_UPDATED : "subscription.updated",
	SUBSCRIPTION_DELETED : "subscription.deleted",
	SUBSCRIPTION_SUCCEEDED : "subscription.succeeded",
	SUBCRIPTION_FAILED : "subscription.failed",
    SUBSCRIPTION_EXPIRING : "subscription.expiring",
    SUBSCRIPTION_DEACTIVATED : "subscription.deactivated",
    SUBSCRIPTION_ACTIVATED : "subscription.activated",
    SUBSCRIPTION_CANCELED : "subscription.canceled",
	REFUND_CREATED : "refund.created",
	REFUND_SUCCEEDED : "refund.succeeded",
	REFUND_FAILED : "refund.failed",
	PAYOUT_TRANSFERRED : "payout.transferred",
	INVOICE_AVAILABLE : "invoice.available",
	APP_MERCHANT_ACTIVATED : "app.merchant.activated",
	APP_MERCHANT_DEACTIVATED : "app.merchant.deactivated",
	APP_MERCHANT_REJECTED : "app.merchant.rejected"
};

Webhook.prototype.getUpdateableFields = function() {
	return ["url", "email", "event_types"];
};
/**
 * Specify an order for webhooks.
 * @class Webhook.Order
 * @memberof Webhook
 * @extends Webhook
 */
Webhook.Order = function() {
	Order.call(this);
};
Webhook.Order.prototype = new Order();
Webhook.Order.constructor = Webhook.Order;

/**
 * @returns {Order} order by url
 * @memberof Webhook.Order
 */
Webhook.Order.url = function() {
	var order = new Webhook.Order();
	order.type = "url";
	return order;
};
/**
 * @returns {Order} order by email
 * @memberof Webhook.Order
 */
Webhook.Order.email = function() {
	var order = new Webhook.Order();
	order.type = "email";
	return order;
};

/**
 * @returns {Order} order by created_at
 * @memberof Webhook.Order
 */
Webhook.Order.created_at = function() {
	var order = new Webhook.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for webhooks.
 * @class Webhook.Filter
 * @memberof Webhook
 * @extends Filter
 */
Webhook.Filter = function() {
	Filter.call(this);
};
Webhook.Filter.prototype = new Filter();
Webhook.Filter.constructor = Webhook.Filter;


/**
 * Add filtering by email
 * @param {string} email the email
 * @returns {Filter} the same filter.
 * @memberof Webhook.Filter
 */
Webhook.Filter.prototype.email = function(email) {
	this.email = email;
	return this;
};
/**
 * Add filtering by url
 * @param {string} url the url
 * @returns {Filter} the same filter.
 * @memberof Webhook.Filter
 */
Webhook.Filter.prototype.url = function(url) {
	this.url = url;
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Webhook.Filter
 */
Webhook.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};


/**
 * The {@link Webhook} object.
 */
exports.Webhook = Webhook;
