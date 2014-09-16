/** @module paymill */

var __ = require("underscore");

var apiHost = "api.paymill.com";
var apiBaseUrl = "/v2.1";
var apiEncoding = "utf8";
/* note, we have to edit this manually, as the package.json is available only in node*/
var version = "1.1.0";
var sourcePrefix = "paymill-js";

function ExternalHandler() {

}

ExternalHandler.prototype.apiKey = null;
ExternalHandler.prototype.setApiKey = function(apiKey) {
	this.apiKey = apiKey;
};

ExternalHandler.prototype.getDeferedObject = function() {
	throw new PMError(PMError.Type.INTERNAL, "ExternalHandler.getDeferedObject() is abstract! Did you initialze?");
};

ExternalHandler.prototype.getPromiseObject = function(defer) {
	throw new PMError(PMError.Type.INTERNAL, "ExternalHandler.getPromiseObject() is abstract! Did you initialze?");

};

/**
 * Make a single http request.
 * @param {HttpRequest} httpRequest a http request object, describing all properties of the request
 * @abstract
 * @return {object} a promise
 */
ExternalHandler.prototype.httpRequest = function(httpRequest) {
	throw new PMError(PMError.Type.INTERNAL, "ExternalHandler.httpRequest() is abstract! Did you initialze?");
};
ExternalHandler.prototype.includeCallbackInPromise = function(httpRequest) {
	throw new PMError(PMError.Type.INTERNAL, "ExternalHandler.includeCallbackInPromise() is abstract! Did you initialze?");
};

/*
 * Identifis the handler type.
 * @abstract
 * @return {string} the identifier of this handler, e.g. "node","parse"
 */
ExternalHandler.prototype.getHandlerIdentifier = function() {
	throw new PMError(PMError.Type.INTERNAL, "ExternalHandler.getSourceIdentifier() is abstract! Did you initialze?");
};

/*
 * Identify the wrapper version against the REST API.
 * @abstract
 * @return {string} the source parameter for transactions and preauthorizations. handler, e.g. "paymill-js-node-1.0.1"
 */
function getSourceIdentifier() {
	return sourcePrefix + "-" + platformIdentifier + "-" + version;
}
/**
 * Callback for HttpClient requests.
 * @callback HttpClient~requestCallback
 * @param {PMError} error a PMError for failure
 * @param {string} responseMessage
 */

function HttpRequest(path, method, params) {
	this.path = path;
	this.method = method;
	this.params = params;
	this.requestBody = null;
	this.headers = {};
	if (method == "GET" || method == "DELETE") {
		this.path = this.path + urlEncode(params, true);
		this.headers = {
			"Content-Length" : 0
		};
	} else {
		if (params !== null) {
			this.requestBody = urlEncode(params, false);
			this.headers = {
				"Content-Type" : "application/x-www-form-urlencoded",
				"Content-Length" : this.requestBody.length
			};
		}
	}
}

/**
 * Checks if an http text response contains json and a data field.
 * @param data the http response as string
 * @returns {boolean} true if json and data is present, else otherwise (e.g. error)
 */
function isDataPresent(data) {
    try {
        var parsedData = JSON.parse(data);
        if (parsedData.data !== undefined && parsedData.data !== null) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}
/**
 * PaymillContecxt loads the context of PAYMILL for a single account, by providing a merchants private key<br />
 * It creates 8 services, which represents the PAYMILL API:
 * @param apiKey
 * @constructor
 */

/**
 *
 * A PaymillContext represents one client of the PAYMILL API. It holds the API key and exposes the 8 services,
 * which correspond to the API endpoints.
 * @class PaymillContext
 */
function PaymillContext(apiKey) {
    // initalize services
    this.handler = handlerConstructor(apiKey);
    this.clients = new ClientService();
    this.clients.setHandler(this.handler);
    this.offers = new OfferService();
    this.offers.setHandler(this.handler);
    this.payments = new PaymentService();
    this.payments.setHandler(this.handler);
    this.preauthorizations = new PreauthorizationService();
    this.preauthorizations.setHandler(this.handler);
    this.refunds = new RefundService();
    this.refunds.setHandler(this.handler);
    this.subscriptions = new SubscriptionService();
    this.subscriptions.setHandler(this.handler);
    this.transactions = new TransactionService();
    this.transactions.setHandler(this.handler);
    this.webhooks = new WebhookService();
    this.webhooks.setHandler(this.handler);
}

PaymillContext.prototype.constructor = PaymillContext;
PaymillContext.prototype.handler = null;
PaymillContext.prototype.apiKey = null;
PaymillContext.prototype.setApiKey = function(apiKey) {
    this.handler.setApiKey(apiKey);
};

/**
 * The {@link ClientService} service.
 */
PaymillContext.prototype.clients = null;
/**
 * The {@link OfferService} service.
 */
PaymillContext.prototype.offers = null;
/**
 * The {@link PaymentService} service.
 */
PaymillContext.prototype.payments = null;
/**
 * The {@link PreauthorizationService} service.
 */
PaymillContext.prototype.preauthorizations = null;
/**
 * The {@link RefundService} service.
 */
PaymillContext.prototype.refunds = null;
/**
 * The {@link TransactionService} service.
 */
PaymillContext.prototype.transactions = null;
/**
 * The {@link SubscriptionService} service.
 */
PaymillContext.prototype.subscriptions = null;
/**
 * The {@link WebhookService} service.
 */
PaymillContext.prototype.webhooks = null;

exports.PaymillContext = PaymillContext;
exports.getContext = function(apiKey) {
    return new PaymillContext(apiKey);
};
