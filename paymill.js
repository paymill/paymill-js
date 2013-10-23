/** @module paymill */

var __ = require("underscore");

var apiHost = "api.paymill.com";
var apiBaseUrl = "/v2";
var apiEncoding = "utf8";

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

/**
 * Callback for HttpClient requests.
 * @callback HttpClient~requestCallback
 * @param {PMError} error a PMError for failure
 * @param {string} responseMessage
 */

function HttpRequest(path, method, params) {
	this.path = path;
	this.method = method;
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
 * Initialize the wrapper with your private API key.
 * @param {string} apiKey your private PAYMILL API key.
 *
 */
exports.initialize = function(apiKey) {
	external.setApiKey(apiKey);
};
