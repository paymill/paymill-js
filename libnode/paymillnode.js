function NodeHandler() {
	this.when = require("when");
	this.https = require("https");
}

NodeHandler.prototype = ExternalHandler.prototype;
NodeHandler.prototype.constructor = NodeHandler;
NodeHandler.prototype.getDeferedObject = function() {
	return this.when.defer();
};

NodeHandler.prototype.getPromiseObject = function(defer) {
	return defer.promise;

};
NodeHandler.prototype.httpRequest = function(httpRequest) {
	var defer = this.getDeferedObject();
	var promise = this.getPromiseObject(defer);
	var options = {
		hostname : apiHost,
		port : 443,
		path : apiBaseUrl + httpRequest.path,
		auth : this.apiKey + ":",
		method : httpRequest.method,
		headers : httpRequest.headers
	};
	var req = this.https.request(options, function(res) {
		res.setEncoding(apiEncoding);
		var status = res.statusCode;
		var headers = res.headers;
		var data = "";
		res.on("data", function(d) {
			data = data + d;
		});
		res.on("end", function() {
            if (!isDataPresent(data)) {
				defer.reject(new PMError(PMError.Type.API, data, "http status code:" + status + "\nheaders:" + headers + "\ndata:" + data, JSON.stringify(data)));
			} else {
				defer.resolve(data);
			}
		});

	});

	req.on("error", function(e) {
		defer.reject(new PMError(PMError.Type.IO, null, e.toString()));
	});
	if ( typeof httpRequest.requestBody === "string" && httpRequest.requestBody.length > 0) {
		req.write(httpRequest.requestBody);
	}
	req.end();
	return promise;
};
NodeHandler.prototype.includeCallbackInPromise = function(promise, callback) {
	var positive, negative;
	if (__.isFunction(callback)) {
		var when = this.when;
		positive = function(result) {
			callback(null, result);
			return when.resolve(result);
		};
		negative = function(error) {
			callback(error);
			return when.reject(error);
		};
		promise.then(positive, negative);
	}
	return promise;
};

NodeHandler.prototype.getHandlerIdentifier = function() {
	return "node";
};

var handlerConstructor = function(apiKey) {
    var handler=new NodeHandler();
    handler.setApiKey(apiKey);
    return handler;
};
var platformIdentifier = 'node';