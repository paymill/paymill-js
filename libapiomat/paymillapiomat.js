function ApiomatHandler()
{
	
	this.when = require('when');
}

ApiomatHandler.prototype = ExternalHandler.prototype;
ApiomatHandler.prototype.constructor = ApiomatHandler;
ApiomatHandler.prototype.getDeferedObject = function() {
	return this.when.defer();
};

ApiomatHandler.prototype.getPromiseObject = function(defer) {
	return defer.promise;

};
ApiomatHandler.prototype.httpRequest = function(httpRequest) {
	var defer = this.getDeferedObject();
	var promise = this.getPromiseObject(defer);
	
	var path = "https://" + apiHost + apiBaseUrl + httpRequest.path;
	var headers =  httpRequest.headers;
	/* set Auth */
	headers['Authorization'] = 'Basic ' + AOM.toBase64(this.apiKey + ':');
	/* remove Content-Length header if 0 (else error occurres */
	if(headers['Content-Length'] && headers['Content-Length'] == '0.0')
	{
		delete headers['Content-Length'];
	}
	/* Callback handlers */
	var successCB = function (msg, code) {
        if (!isDataPresent(msg)) {
			defer.reject(new PMError(PMError.Type.API, data, "http status code:" + code + "\nheaders:" + headers + "\ndata:" + msg, JSON.stringify(data)));
		}
		else
		{
			defer.resolve(msg);
		}
	};
	var errorCB = function (msg, code) {
		AOM.logError(msg);
		defer.reject(new PMError(PMError.Type.IO, null, msg));		
	};

	var body = '';
	if ( typeof httpRequest.requestBody === "string" && httpRequest.requestBody.length > 0) {
		body = httpRequest.requestBody;
	}

	/* Send requests */
	if(httpRequest.method === 'GET')
	{
		/* remove Content-Length header if 0 (else error occurres ) */
		delete headers['Content-Length'];
		AOM.getRequest( path, headers, successCB, errorCB);
	}
	else if(httpRequest.method === 'POST')
	{		
		AOM.postRequestEntity( path, body, headers, successCB, errorCB);
	}
	else if(httpRequest.method === 'PUT')
	{	
		AOM.putRequest( path, params, headers, successCB, errorCB);
	}
	else if(httpRequest.method === 'DELETE')
	{
		/* remove Content-Length header if 0 (else error occurres ) */
		delete headers['Content-Length'];
		AOM.deleteRequest( path, headers, successCB, errorCB);
	}

	return promise;
};
ApiomatHandler.prototype.includeCallbackInPromise = function(promise, callback) {
	var positive, negative;
	if (!callback) {
		return promise;
	}
	if (__.isFunction(callback.onOk)) {
		positive = function(result) {
			callback.onOk(result);
			return when.resolve(result);
		};
	}
	if (__.isFunction(callback.onError)) {
		negative = function(error) {
			callback.onError(error);
			return when.reject(error);
		};
	}
	if (positive !== undefined || negative !== undefined) {
		promise.then(positive, negative);
	}
	return promise;
};

ApiomatHandler.prototype.getHandlerIdentifier = function() {
	return "apiomat";
};

var handlerConstructor = function(apiKey) {
    var handler=new ApiomatHandler();
    handler.setApiKey(apiKey);
    return handler;
};
var platformIdentifier = 'apiomat';