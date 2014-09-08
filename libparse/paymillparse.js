function ParseHandler() {
}

ParseHandler.prototype = ExternalHandler.prototype;
ParseHandler.prototype.constructor = ParseHandler;

ParseHandler.prototype.getDeferedObject = function() {
	return new Parse.Promise();
};

ParseHandler.prototype.getPromiseObject = function(promise) {
	return promise;
};
ParseHandler.prototype.httpRequest = function(httpRequest) {
	var defer = external.getDeferedObject();
	var promise = external.getPromiseObject(defer);
	var reqParam = {
		url : "https://" + this.apiKey + ":@" + apiHost + apiBaseUrl + httpRequest.path,
		method : httpRequest.method,
		success : function(httpResponse) {
            if (!isDataPresent(httpResponse.text)) {
				defer.reject(new PMError(PMError.Type.API, httpResponse.text, "http status code:" + httpResponse.status + "\nheaders:" + httpResponse.headers + "\ndata:" + httpResponse.text));
			} else {
				defer.resolve(httpResponse.text);
			}
		},
		error : function(httpResponse) {
			defer.reject(new PMError(PMError.Type.API, httpResponse.text, "http status code:" + httpResponse.status + "\nheaders:" + httpResponse.headers + "\ndata:" + httpResponse.text));
		}
	};
	if (httpRequest.method=="POST" || httpRequest.method=="PUT") {
		reqParam.body=httpRequest.params;
	}
	Parse.Cloud.httpRequest(reqParam);
	return promise;
};
ParseHandler.prototype.includeCallbackInPromise = function(promise,callback) {
	var positive, negative;
	if (!callback) {
		return promise;
	}
	if (__.isFunction(callback.success)) {
		positive = function(result) {
			callback.success(result);
			return Parse.Promise.as(result);
		};
	}
	if (__.isFunction(callback.error)) {
		negative = function(error) {
			callback.error(error);
			return Parse.Promise.error(error);
		};
	}
	if (positive !== undefined || negative !== undefined) {
		promise.then(positive, negative);
	}
	return promise;
};

ParseHandler.prototype.getHandlerIdentifier = function() {
	return "parse";
};


var handlerConstructor = function(apiKey) {
    var handler=new ParseHandler();
    handler.setApiKey(apiKey);
    return handler;
};
var platformIdentifier = 'parse';