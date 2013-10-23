function PMError(type, message, detailMessage) {
	if (message && message.length > 0) {
		this.message = type + ":" + message;
	} else {
		this.message = type + ".";
	}
	this.detailMessage = detailMessage;
	this.type = type;
	return this;
}

PMError.prototype = Error.prototype;
PMError.prototype.constructor = PMError;
PMError.prototype.name = "PMError";

PMError.Type = {
	API : "API Error",
	WRONG_PARAMS : "Invalid arguments",
	IO : "Network issue",
	NOT_INIT : "Not initialized",
	INTERNAL : "Internal error"
};
exports.PMError=PMError;