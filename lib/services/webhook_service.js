/**
 *
 * Creates a new WebhookService. Generally you should never create a PAYMILL service on your own. Instead use the exported "webhooks".
 * @class WebhookService
 */
function WebhookService() {

}

WebhookService.prototype = new PaymillService();
WebhookService.prototype.constructor = WebhookService;
WebhookService.prototype.getPaymillObject = function() {
	return Webhook;
};
WebhookService.prototype.getEndpointPath = function() {
	return "/webhooks";
};

/**
 * With this call you can create a webhook to a url via the API.
 *  @param {string} url the url of the webhook
 * @param {Array.<string>} event_types includes a set of webhook event types as strings.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Webhook or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.createUrl = function(url, event_types, cb) {
	if (!__.isString(url)) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "url must be a string"));
	}
	if (!event_types || !event_types.length || event_types.length < 1) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "invalid event types. supply a string array with at least 1 type"));

	}
	var map = {
		url : url,
		event_types : event_types
	};
	return this._create(map, Webhook, cb);

};
/**
 * Instead of setting the url parameter you can set the email parameter to create a webhook, where we send mails to in case of an event.
 *  @param {string} email the webhooks email. must be a valid mail address.
 * @param {Array.<string>} event_types includes a set of webhook event types as strings.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Webhook or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.createEmail = function(email, event_types, cb) {
	if (!__.isString(email)) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "email must be a string"));
	}
	if (!event_types || !event_types.length || event_types.length < 1) {
		return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "invalid event types. supply a string array with at least 1 type"));

	}
	var map = {
		email : email,
		event_types : event_types
	};
	return this._create(map, Webhook, cb);

};

/**
 * List Webhooks.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Webhook.Filter|null)} [filter] a list filter or null.
 * @param {(Webhook.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Webhook. f you set the attribute cancel_at_period_end parameter to the value true, the subscription will remain active until the end of the period. The subscription will not be renewed again. If the value is set to false it is directly terminated but pending transactions will still be charged.
 * @param {Webhook} obj a Webhook object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Webhook or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Webhook.
 * @param {(string|Webhook)} obj a Webhook object or its id. note, if you set a Webhook object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Webhook or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};
/**
 * Update a Webhook.
 * @param {Webhook} obj a Webhook object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
WebhookService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};

/**
 * The {@link WebhookService} service.
 */
exports.webhooks = new WebhookService();
