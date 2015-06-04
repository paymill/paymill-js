/** @module paymill */

var __ = require("underscore");

var apiHost = "api.paymill.com";
var apiBaseUrl = "/v2.1";
var apiEncoding = "utf8";
/* note, we have to edit this manually, as the package.json is available only in node*/
var version = "2.0.3";
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
	if (method === "GET" || method === "DELETE") {
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
function PMError(type, message, detailMessage, apiMessage) {
	if (message && message.length > 0) {
		this.message = type + ":" + message;
	} else {
		this.message = type + ".";
	}
	this.detailMessage = detailMessage;
	this.apiMessage = apiMessage;
	this.type = type;
	return this;
}

PMError.prototype = new Error();
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
function deserializePaymillObject(parsedJson, objectType) {
	if (parsedJson === undefined || parsedJson === null) {
		return null;
	}
	var result = new objectType.prototype.constructor();	
	result.fromJson(parsedJson);
	return result;
}

function deserializePaymillObjectList(parsedJson, objectType) {
	if (parsedJson === undefined || parsedJson === null) {
		return null;
	}
	var result = new Array(parsedJson.length);
	for (var i = 0; i < parsedJson.length; i++) {
		result[i] = deserializePaymillObject(parsedJson[i], objectType);
	}
	return result;
}

function deserializeDate(unixTime) {
	if (unixTime === undefined || unixTime === null) {
		return null;
	}
	if (!__.isNumber(unixTime)) {
		return unixTime;
	}
	return new Date(unixTime*1000);
}

function urlEncode(params, appendQuestion) {
	if (!params) {
		return "";
	}
	var ret = [];
	for (var key in params) {
		if (key === "" || __.isFunction(params[key])) {
			continue;
		}
		ret.push(key + "=" + encodeURIComponent(params[key]));
	}
	if (ret.length > 0) {
		var result = ret.join("&");
		if (appendQuestion) {
			return "?" + result;
		} else {
			return result;
		}

	} else {
		return "";
	}
}

function getTimeFromObject(obj) {
	if ( obj instanceof Date) {
		return obj.getTime();
	}
	if (__.isString(obj) || __.isNumber(obj)) {
		return obj;
	}

	throw new PMError(PMError.Type.WRONG_PARAMS, obj + "must be either a string, a number or a Date");
}

function validateField(validationFunc, field, fieldName, optional) {
    if (field !== undefined && field !== null) {
        validationFunc(field,fieldName);
    } else {
        if (!optional) {
            throw new PMError(PMError.Type.WRONG_PARAMS, fieldName + " is mandatory");
        }
    }
}
function validateMandatory(field,fieldName) {
    if (__.isEmpty(field)) {
        throw new PMError(PMError.Type.WRONG_PARAMS, fieldName + " is mandatory");
    }
}
function validateNumber(field, fieldname, optional) {
    return validateField(function (number,numberName) {
        if (! (__.isNumber(number) || __.isNumber(parseInt(number,10))) ) {
            throw new PMError(PMError.Type.WRONG_PARAMS, numberName + " must be a number or a string representing a number");
        }
    },field,fieldname,optional);
}
function validateBoolean(field, fieldname, optional) {
    return validateField(function (boolean, booleanName) {
        if (! (__.isBoolean(boolean)) ) {
            throw new PMError(PMError.Type.WRONG_PARAMS, booleanName + " must be a boolean");
        }
    },field,fieldname,optional);
}

function validateString(field, fieldname, optional) {
    return validateField(function (string,stringName) {
        if (!(__.isString(string) ) ) {
            throw new PMError(PMError.Type.WRONG_PARAMS, stringName + " must be a string");
        }
    },field,fieldname,optional);
}

function getTimeFilter(from, to) {
    return getTimeFromObject(from) + "-" + getTimeFromObject(to);
}

function getIdFromObject(obj, objectType) {
	if (!obj) {
		throw new PMError(PMError.Type.WRONG_PARAMS, "Object must be either a string or object with a string member 'id', but it is not defined");
	}
	if (__.isString(obj) && !__.isEmpty(obj)) {
		return obj;
	}
	if (objectType) {
		//there is an object type
		if ( obj instanceof objectType && obj.id && __.isString(obj.id)) {
			return obj.id;
		}
	} else {
		// no object type defined
		if (obj.id && __.isString(obj.id)) {
			return obj.id;
		}
	}
	throw new PMError(PMError.Type.WRONG_PARAMS, obj + "must be either a string or " + objectType + " with a valid id.");
}
function getRefreshObject(obj,type) {
    if ( obj instanceof type ) {
        if (!__.isEmpty(obj.id)) {
            return obj;
        } else {
            throw new PMError(PMError.Type.WRONG_PARAMS, obj + " is of correct type ( " + type + " ), but has no valid id.");
        }
    } else {
        var id = getIdFromObject(obj, type);
        var result = new type.prototype.constructor();
        result.id=id;
        return result;
    }
}

function getRealEquality(equality) {
    if (equality === undefined) {
        return Filter.EQUALITY.EQUAL;
    } else {
        return equality;
    }
}
function getUnixTimeFromParam(param, paramName) {
    if ( param instanceof Date) {
        return Math.floor((param.getTime())/1000);
    } else if (__.isNumber(param) || __.isString(param)) {
        return param;
    } else {
        throw new PMError(PMError.Type.WRONG_PARAMS, "parameter " + paramName + " must be a Date, number or string");
    }
}
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

/**
 *
 * Creates a new Fee. Generally you should never create a PAYMILL object on your own.
 * @class Fee
 * @extends PaymillObject
 * @classdesc Describes app fees.
 */
function Fee() {

}

Fee.prototype = new PaymillObject();
Fee.prototype.constructor = Fee;

/**
 * Fee type
 * @type {Fee.Type}
 * @memberof Fee.prototype
 */
Fee.prototype.type = null;

/**
 * Unique identifier of the app which charges the fee
 * @type {string}
 * @memberof Fee.prototype
 */
Fee.prototype.application = null;

/**
 * Unique identifier of the payment from which the fee will be charged
 * @type {string}
 * @memberof Fee.prototype
 */
Fee.prototype.payment = null;

/**
 * Fee amount in the smallest currency unit e.g. "420" for 4.20 €
 * @type {number}
 * @memberof Fee.prototype
 */
Fee.prototype.amount = null;

/**
 * ISO 4217 formatted currency code.
 * @type {string}
 * @memberof Fee.prototype
 */
Fee.prototype.currency = null;
/**
 * Unix-Timestamp for the billing date.
 * @type {Date}
 * @memberof Fee.prototype
 */
Fee.prototype.billed_at = null;

/*
 * special fields
 */
Fee.prototype.getFieldDefinitions = function() {
	return {
		billed_at : deserializeDate
	};
};

/**
 * Type of a Fee.
 * @memberof Fee
 * @property {string} APPLICATION
 */
Fee.Type = {
	"APPLICATION" : "application"
};

/**
 *
 * Creates a new Filter. Use factories of implementing classes.
 * @class Filter
 */
function Filter() {

}
/**
 * Descibes equality for filters.
 * @memberof Filter
 * @property {string} EQUAL
 * @property {string} LESS_THAN
 * @property {string} GREATER_THAN
 */
Filter.EQUALITY = {
	"LESS_THAN" : "<",
	"GREATER_THAN" : ">",
	"EQUAL" : ""
};
/**
 *
 * Creates a new Interval.
 * @class Interval
 * @param {number} length length of the interval (in units)
 * @param {string|Interval.Unit} Unit for the interval
 * @param {string|Interval.Weekday} weekday on which a charge should occur
 * @extends PaymillObject
 * @classdesc Defining an interval for an offer.
 */
function Interval(length, unit, weekday) {
	this.length = length;
	this.unit = unit;
    this.chargeday = weekday;
}

Interval.prototype = new PaymillObject();
Interval.prototype.constructor = Interval;
/**
 * Length of the interval (in units)
 * @type {number}
 * @memberof Interval.prototype
 */
Interval.prototype.length = null;
/**
 * Unit for the interval
 * @type {Interval.Unit}
 * @memberof Interval.prototype
 */
Interval.prototype.unit = null;
/**
 * Charge day in the week
 * @type {Interval.Weekday}
 * @memberof Interval.prototype
 */
Interval.prototype.chargeday = null;


Interval.prototype.fromJson = function(jsonObj) {
    var weekdayParts = jsonObj.split(',');
    if (weekdayParts.length > 1) {
        this.chargeday = weekdayParts[1];
    }
	var split = weekdayParts[0].split(" ");
	this.length = parseInt(split[0],10);
	this.unit = split[1];
	this.originalJson = jsonObj;
};
Interval.prototype.toString = function() {
    var chargedayPart = (__.isEmpty(this.chargeday)) ? '': ',' + this.chargeday;
	return "" + this.length + " " + this.unit + chargedayPart;
};

Interval.prototype.getUpdateIdentifier = function() {
    return this.toString();
};
/**
 * Units for an Interval.
 * @memberof Interval
 * @property {string} DAY
 * @property {string} WEEK
 * @property {string} MONTH
 * @property {string} YEAR
 */
Interval.Unit = {
	"DAY" : "DAY",
	"WEEK" : "WEEK",
	"MONTH" : "MONTH",
	"YEAR" : "YEAR"
};

/**
 * Weekdays for an Interval.
 * @memberof Interval
 * @property {string} MONDAY
 * @property {string} TUESDAY
 * @property {string} WEDNESDAY
 * @property {string} THURSDAY
 * @property {string} FRIDAY
 * @property {string} SATURDAY
 * @property {string} SUNDAY
 */
Interval.Weekday = {
    MONDAY : "MONDAY",
    TUESDAY : "TUESDAY",
    WEDNESDAY : "WEDNESDAY",
    THURSDAY : "THURSDAY",
    FRIDAY : "FRIDAY",
    SATURDAY : "SATURDAY",
    SUNDAY : "SUNDAY"
};
exports.Interval=Interval;
/**
 *
 * Creates a new Offer. Generally you should never create a PAYMILL object on your own.
 * @class Offer
 * @extends PaymillObject
 * @classdesc An offer is a recurring plan which a user can subscribe to. You can create different offers with different plan attributes e.g. a monthly or a yearly based paid offer/plan.
 */
function Offer() {

}

Offer.prototype = new PaymillObject();
Offer.prototype.constructor = Offer;
/**
 * Unique identifier of this offer.
 * @type {string}
 * @memberof Offer.prototype
 */

Offer.prototype.id = null;
/**
 * Your name for this offer
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.name = null;

/**
 * Every interval the specified amount will be charged. Only integer values are allowed (e.g. 42.00 = 4200).
 * @type {number}
 * @memberof Offer.prototype
 */
Offer.prototype.amount = null;

/**
 * ISO 4217 formatted currency code
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.currency = null;

/**
 * Defining how often the client should be charged.
 * @type {Interval}
 * @memberof Offer.prototype
 */
Offer.prototype.interval = null;

/**
 * Give it a try or charge directly?.
 * @type {number}
 * @memberof Offer.prototype
 */
Offer.prototype.trial_period_days = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Offer.prototype
 */
Offer.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Offer.prototype
 */
Offer.prototype.updated_at = null;

/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof SubscriptionCount.prototype
 */
Offer.prototype.subscription_count = null;

/**
 * App (ID) that created this offer or null if created by yourself.
 * @type {string}
 * @memberof Offer.prototype
 */
Offer.prototype.app_id = null;

/*
 * special fields
 */
Offer.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		interval : function(json) {
			return deserializePaymillObject(json, Interval);
		},
		subscription_count : function(json) {
			return deserializePaymillObject(json, SubscriptionCount);
		}
	};
};

Offer.prototype.getUpdateableFields = function() {
	return ["name"];
};

/**
 * Specify an order for clients.
 * @class Offer.Order
 * @memberof Offer
 * @extends Order
 */
Offer.Order = function() {
	Order.call(this);
};
Offer.Order.prototype = new Order();
Offer.Order.constructor = Offer.Order;

/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.interval = function() {
	var order = new Offer.Order();
	order.type = "interval";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.amount = function() {
	var order = new Offer.Order();
	order.type = "amount";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.created_at = function() {
	var order = new Offer.Order();
	order.type = "created_at";
	return order;
};
/**
 * @returns {Order} order by creditcard
 * @memberof Offer.Order
 */
Offer.Order.trial_period_days = function() {
	var order = new Offer.Order();
	order.type = "trial_period_days";
	return order;
};

/**
 * Specify a filter for offers.
 * @class Offer.Filter
 * @memberof Offer
 * @extends Filter
 */

Offer.Filter = function() {
	Filter.call(this);
};
Offer.Filter.prototype = new Filter();
Offer.Filter.constructor = Offer.Filter;

/**
 * Add filtering by name
 * @param {string} name the name of the offer.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.name = function(name) {
	this.name = name;
	return this;
};
/**
 * Add filtering by trial_period_days
 * @param {(string|number)} client the trial_period_days of the offer.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.trial_period_days = function(trial_period_days) {
	this.trial_period_days = trial_period_days;
	return this;
};
/**
 * Add filtering by amount. e.g. "300" or ">300" or "<300"
 * @param {(string|number)} amount the amount to be filtered
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * Add filtering by updated_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Offer.Filter
 */
Offer.Filter.prototype.updated_at = function(from, to) {
	this.updated_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Offer} object.
 */
exports.Offer = Offer;

/**
 *
 * Creates a new Order. Use factories of implementing classes.
 * @class Order
 */
function Order() {

}

/**
 * Is the order ascending?
 * @type {boolean}
 * @memberOf Order
 */
Order.prototype.ascending = null;
/**
 * The type of the order, overwritten by concrete implmentations
 * @abstract
 * @type {boolean}
 * @memberOf Order
 */
Order.prototype.type = null;
/**
 * Change the order to ascending
 * @return {Order} the same order for chaining
 * @memberOf Order
 */
Order.prototype.asc = function() {
	this.ascending = true;
	return this;
};

/**
 * Change the order to descending.
 * @return {Order} the same order for chaining
 * @memberOf Order
 */
Order.prototype.desc = function() {
	this.ascending = false;
	return this;
};
/**
 * Create the http map for an order
 * @return {*} a mixed object with the Order
 * @memberOf Order
 */
Order.prototype.toHttpMap = function() {
	var s = this.type;
	if ( typeof this.ascending !== null) {
		if (this.ascending) {
			s = s + "_asc";
		} else {
			s = s + "_desc";
		}
	}
	return {
		"order" : s
	};
};

/**
 *
 * Creates a new payment. Generally you should never create a PAYMILL object on your own.
 * @class Payment
 * @classdesc The Payment object represents a payment with a credit card or via direct debit. It is used for several function calls (e.g. transactions, subscriptions, clients, ...). To be PCI compliant these information is encoded by our Paymill PSP. You only get in touch with safe data (token) and needn't to care about the security problematic of informations like credit card data.
 */
function Payment() {

}

Payment.prototype = new PaymillObject();
Payment.prototype.constructor = Payment;

/**
 * Unique identifier for this payment.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.id = null;

/**
 * The type of the payment.
 * @type {Payment.Type}
 * @memberof Payment.prototype
 */
Payment.prototype.type = null;

/**
 * The identifier of a client (client-object)
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.client = null;
/**
 * Card type eg. visa, mastercard. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.card_type = null;

/**
 * Country. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.country = null;

/**
 * Expiry month of the credit card. Only for credit card payments.
 * @type {number}
 * @memberof Payment.prototype
 */
Payment.prototype.expire_month = null;
/**
 * Expiry year of the credit card. Only for credit card payments.
 * @type {number}
 * @memberof Payment.prototype
 */
Payment.prototype.expire_year = null;
/**
 * The last four digits of the credit card. Only for credit card payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.last4 = null;
/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Payment.prototype
 */
Payment.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Payment.prototype
 */
Payment.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.app_id = null;
/**
 * The used account number, for security reasons the number is masked. Only for direct debit payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.account = null;

/**
 * Whether or not this payment is recurring (can be used more than once).
 * @type {boolean}
 * @memberof Payment.prototype
 */
Payment.prototype.is_recurring = null;

/**
 * Whether or not this payment is usable for preauthorization.
 * @type {boolean}
 * @memberof Payment.prototype
 */
Payment.prototype.is_usable_for_preauthorization = null;

/**
 * Name of the account holder. Only for direct debit payments.
 * @type {string}
 * @memberof Payment.prototype
 */
Payment.prototype.holder = null;
/**
 * The type of payment.
 * @memberof Payment
 * @property {string} CREDITCARD a credit card payment.
 * @property {string} DEBIT a direct debit payment.
 */
Payment.Type = {
	CREDITCARD : "creditcard",
	DEBIT : "debit"
};
/*
 * special fields
 */
Payment.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate
	};
};

/**
 * Specify an order for payments.
 * @class Payment.Order
 * @memberof Payment
 * @extends Order
 */
Payment.Order = function() {
	Order.call(this);
};
Payment.Order.prototype = new Order();
Payment.Order.constructor = Payment.Order;

/**
 * @returns {Order} order by created_at
 * @memberof Payment.Order
 */
Payment.Order.created_at = function() {
	var order = new Payment.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for payments.
 * @class Payment.Filter
 * @memberof Payment
 * @extends Filter
 */
Payment.Filter = function() {
	Filter.call(this);
};
Payment.Filter.prototype = new Filter();
Payment.Filter.constructor = Payment.Filter;

/**
 * Add filtering by card_type
 * @param {string} card_type e.g. "visa", "mastercard" etc.
 * @returns {Filter} the same filter.
 * @memberof Payment.Filter
 */
Payment.Filter.prototype.card_type = function(card_type) {
	this.card_type = card_type;
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Payment.Filter
 */
Payment.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Payment} object.
 */
exports.Payment = Payment;

/**
 *
 * Creates a new PaymillList. Used internally.
 * @class PaymillList
 * @extends PaymillObject
 * @classdesc The list object is used to devliver list results. The actual array is contained in the items property, while count holds the total count.
 */

function PaymillList() {

}

/**
 * Total count of items. Usefull to control pagination.
 * @type {number}
 * @memberof PaymillList.prototype
 */
PaymillList.prototype.count = null;
/**
 * The actual items.
 * @type {Array}
 * @memberof PaymillList.prototype
 */
PaymillList.prototype.items = null;

exports.PaymillList = PaymillList;

function PaymillObject() {

}

PaymillObject.prototype.originalJson = null;

/**
 * @return {object} an object with fields, that require special deserialization
 */
PaymillObject.prototype.getFieldDefinitions = function() {
	return {};
};
PaymillObject.prototype.fromJson = function(jsonObj) {
    // if we only have a string, it's just the id
    if ( __.isString(jsonObj) ) {
        this.id = jsonObj;
        this.originalJson = jsonObj;
    } else {
    // if we have a complex object, deserialize
        var fieldDefs = this.getFieldDefinitions();
        for (var key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                var value = jsonObj[key];
                if (fieldDefs[key] !== undefined) {
                    this[key] = fieldDefs[key](value);
                } else {
                    if (this[key] !== undefined) {
                        this[key] = value;
                    }
                }
            }
        }
        this.originalJson = jsonObj;
    }

};
PaymillObject.prototype.getUpdateMap = function() {

	var updateFields = this.getUpdateableFields();
	var result = {};
	for (var i = 0; i < updateFields.length; i++) {
		var key = updateFields[i];
		if (this[key] !== undefined && this[key] !== null)  {
			result[key] = getUpdateValueOrId(this[key]);
		}
	}
	return result;
};

PaymillObject.prototype.getUpdateIdentifier = function() {
    return this.id;
};
/*
 * use by updatemap to extract paymillobject ids for updates
 */
function getUpdateValueOrId(value) {
	if ( value instanceof PaymillObject ) {
		return value.getUpdateIdentifier();
	} else {
		return value.toString();
	}
}
PaymillObject.prototype.getUpdateableFields = function() {
	return {};
};

/**
 *
 * Creates a new Preauthorization. Generally you should never create a PAYMILL object on your own.
 * @class Preauthorization
 * @classdesc If you'd like to reserve some money from the client's credit card but you'd also like to execute the transaction itself a bit later, then use preauthorizations. This is NOT possible with direct debit. <br/>A preauthorization is valid for 7 days.
 */
function Preauthorization() {

}

Preauthorization.prototype = new PaymillObject();
Preauthorization.prototype.constructor = Preauthorization;

/**
 * Unique identifier for this payment.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.id = null;

/**
 * Formatted amount which will be reserved for further transactions.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.amount = null;

/**
 * ISO 4217 formatted currency code.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.currency = null;

/**
 * Additional description for this preauthorization.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.description = null;

/**
 * Indicates the current status of this preauthorization.
 * @type {Preauthorization.Status}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.status = null;

/**
 * Whether this preauthorization was issued while being in live mode or not.
 * @type {boolean}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.livemode = null;

/**
 * Corresponding payment object.
 * @type {Payment}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.payment = null;

/**
 * Corresponding client object.
 * @type {Client}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.client = null;

/**
 * Corresponding Transaction object.
 * @type {Transaction}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.transaction = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Preauthorization.prototype
 */
Preauthorization.prototype.app_id = null;
/**
 * Status of a Preauthorization.
 * @memberof Preauthorization
 * @property {string} OPEN
 * @property {string} PENDING
 * @property {string} CLOSED
 * @property {string} FAILED
 * @property {string} DELETED
 * @property {string} PREAUTH
 */
Preauthorization.Status = {
	OPEN : "open",
	PENDING : "pending",
	CLOSED : "closed",
	FAILED : "failed",
	DELETED : "deleted",
	PREAUTH : "preauth"
};

/*
 * special fields
 */
Preauthorization.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		payment : function(json) {
			return deserializePaymillObject(json, Payment);
		},
		client : function(json) {
			return deserializePaymillObject(json, Client);
		}
	};
};
/**
 * Specify an order for preauthorizations.
 * @class Preauthorization.Order
 * @memberof Preauthorization
 * @extends Order
 */
Preauthorization.Order = function() {
	Order.call(this);
};
Preauthorization.Order.prototype = new Order();
Preauthorization.Order.constructor = Preauthorization.Order;

/**
 * @returns {Order} order by created_at
 * @memberof Client.Order
 */
Preauthorization.Order.created_at = function() {
	var order = new Client.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for preauthorizations.
 * @class Preauthorization.Filter
 * @memberof Preauthorization
 * @extends Filter
 */
Preauthorization.Filter = function() {
	Filter.call(this);
};
Preauthorization.Filter.prototype = new Filter();
Preauthorization.Filter.constructor = Preauthorization.Filter;

/**
 * Add filtering by payment
 * @param {(string|Client)} client the client object or its id.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.client = function(client) {
	this.client = getIdFromObject(client);
	return this;
};
/**
 * Add filtering by payment
 * @param {(string|Payment)} payment the payment object or its id.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.payment = function(payment) {
	this.payment = getIdFromObject(payment);
	return this;
};
/**
 * Add filtering by amount. e.g. "300" or ">300" or "<300"
 * @param {(string|number)} amount the target amount
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Preauthorization.Filter
 */
Preauthorization.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * The {@link Preauthorization} object.
 */
exports.Preauthorization = Preauthorization;

/**
 *
 * Creates a new Refund. Generally you should never create a PAYMILL object on your own.
 * @class Refund
 * @extends PaymillObject
 * @classdesc Refunds are own objects with own calls for existing transactions. The refunded amount will be credited to the account of the client.
 */
function Refund() {

}

Refund.prototype = new PaymillObject();
Refund.prototype.constructor = Refund;
/**
 * Unique identifier of this refund.
 * @type {string}
 * @memberof Client.prototype
 */

Refund.prototype.id = null;
/**
 * Corresponding transaction object.
 * @type {Transaction}
 * @memberof Refund.prototype
 */
Refund.prototype.transaction = null;

/**
 * The refunded amount.
 * @type {number}
 * @memberof Refund.prototype
 */
Refund.prototype.amount = null;

/**
 * Indicates the current status of this refund.
 * @type {Refund.Status}
 * @memberof Refund.prototype
 */
Refund.prototype.status = null;

/**
 * The description given for this refund.
 * @type {string}
 * @memberof Refund.prototype
 */
Refund.prototype.description = null;

/**
 * Whether this refund happend in test- or in livemode.
 * @type {boolean}
 * @memberof Refund.prototype
 */
Refund.prototype.livemode = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Refund.prototype
 */
Refund.prototype.created_at = null;

/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Refund.prototype
 */
Refund.prototype.updated_at = null;

/**
 * App (ID) that created this payment or null if created by yourself.
 * @type {string}
 * @memberof Refund.prototype
 */
Refund.prototype.app_id = null;

/**
 * A response code or null if details are called.
 * @type {number}
 * @memberof Refund.prototype
 */
Refund.prototype.response_code = null;

/**
 * Status of a Refund.
 * @memberof Refund
 * @property {string} OPEN
 * @property {string} PENDING
 * @property {string} REFUNDED
 */
Refund.Status = {
	OPEN : "open",
	PENDING : "pending",
	REFUNDED : "refunded"
};
Refund.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		transaction : function(json) {
			return deserializePaymillObject(json, Transaction);
		}
	};
};
/**
 * Specify an order for clients.
 * @class Refund.Order
 * @memberof Refund
 * @extends Order
 */
Refund.Order = function() {
	Order.call(this);
};
Refund.Order.prototype = new Order();
Refund.Order.constructor = Refund.Order;

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.transaction = function() {
	var order = new Refund.Order();
	order.type = "transaction";
	return order;
};

/**
 * @returns {Order} order by client
 * @memberof Refund.Order
 */
Refund.Order.client = function() {
	var order = new Refund.Order();
	order.type = "client";
	return order;
};

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.amount = function() {
	var order = new Refund.Order();
	order.type = "amount";
	return order;
};

/**
 * @returns {Order} order by transaction
 * @memberof Refund.Order
 */
Refund.Order.created_at = function() {
	var order = new Refund.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for refunds.
 * @class Refund.Filter
 * @memberof Refund
 * @extends Filter
 */
Refund.Filter = function() {
	Filter.call(this);
};
Refund.Filter.prototype = new Filter();
Refund.Filter.constructor = Refund.Filter;

/**
 * Add filtering by client
 * @param {(string|Client)} client the client object or its id.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.client = function(client) {
	this.payment = getIdFromObject(client);
	return this;
};
/**
 * Add filtering by transaction
 * @param {(string|Transaction)} transaction the transaction object or its id.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.transaction = function(transaction) {
	this.transaction = getIdFromObject(transaction);
	return this;
};

/**
 * Add filtering by amount. e.g. "300" or ">300" or "<300"
 * @param {(string|number)} amount the target amount
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Refund.Filter
 */
Refund.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
}; 


/**
 * The {@link Refund} object.
 */
exports.Refund = Refund;
/**
 *
 * Creates a new Subscription. Generally you should never create a PAYMILL object on your own.
 * @class Subscription
 * @extends PaymillObject
 * @classdesc Subscriptions allow you to charge recurring payments on a client's credit card / to a client's direct debit. A subscription connects a client to the offers-object. A client can have several subscriptions to different offers, but only one subscription to the same offer.
 */
function Subscription() {

}

Subscription.prototype = new PaymillObject();
Subscription.prototype.constructor = Subscription;
/**
 * Unique identifier of this subscription.
 * @type {string}
 * @memberof Subscription.prototype
 */

Subscription.prototype.id = null;
/**
 * Corresponding offer.
 * @type {Offer}
 * @memberof Subscription.prototype
 */
Subscription.prototype.offer = null;

/**
 * Whether this subscription was issued while being in live mode or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.livemode = null;

/**
 * The amount of the subscription in cents
 * @type {number}
 * @memberof Subscription.prototype
 */
Subscription.prototype.amount = null;

/**
 * A one-time amount in cents, will charge once only
 * @type {number}
 * @memberof Subscription.prototype
 */
Subscription.prototype.temp_amount = null;

/**
 * ISO 4217 formatted currency code
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.currency = null;

/**
 * Name of the subscription
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.name = null;

/**
 * Defining how often the client should be charged
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.interval = null;

/**
 * Unix-Timestamp for the trial period start
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.trial_start = null;

/**
 * Unix-Timestamp for the trial period end.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.trial_end = null;

/**
 * Limit the validity of the subscription.
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.period_of_validity = null;

/**
 * Expiring date of the subscription.
 * @type {string|Interval}
 * @memberof Subscription.prototype
 */
Subscription.prototype.end_of_period = null;

/**
 * Unix-Timestamp for the next charge.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.next_capture_at = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.updated_at = null;
/**
 * Unix-Timestamp for the cancel date.
 * @type {Date}
 * @memberof Subscription.prototype
 */
Subscription.prototype.canceled_at = null;

/**
 * Corresponding payment.
 * @type {Payment}
 * @memberof Subscription.prototype
 */
Subscription.prototype.payment = null;
/**
 * Corresponding client.
 * @type {Client}
 * @memberof Subscription.prototype
 */
Subscription.prototype.client = null;

/**
 * App (ID) that created this subscription or null if created by yourself.
 * @type {string}
 * @memberof Subscription.prototype
 */
Subscription.prototype.app_id = null;

/**
 * Subscription is marked as canceled or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.is_canceled = null;

/**
 * Subscription is marked as deleted or not.
 * @type {boolean}
 * @memberof Subscription.prototype
 */
Subscription.prototype.is_deleted = null;

/**
 * SEPA mandate reference, can be optionally specified for direct debit transactions.
 * If specified for other payment methods, it has no effect but must still be valid.
 * If specified, the string must not be empty, can be up to 35 characters long and may contain:<br />
 * <p>
 * <ul>
 * <li>digits 0-9
 * <li>letters a-z A-Z
 * <li>special characters: ‘ , . : + - / ( ) ?
 * <ul>
 * @type {string}
 * @memberof Subscription.prototype
 */
 Subscription.prototype.mandate_reference = null;


/**
 * Shows, if subscription is "active", "inactive", "expired" or "failed"
 * @type {string|Subscription.Status}
 * @memberof Subscription.prototype
 */
Subscription.prototype.status = null;

/**
 * Status of a subscription.
 * @memberof Subscription
 * @property {string} ACTIVE
 * @property {string} INACTIVE
 * @property {string} EXPIRED
 * @property {string} FAILED
 */
Subscription.Status = {
    ACTIVE : "active" ,
    INACTIVE : "inactive",
    EXPIRED : "expired" ,
    FAILED : "failed"
};
/*
 * special fields
 */
Subscription.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		trial_start : deserializeDate,
		trial_end : deserializeDate,
        end_of_period : deserializeDate,
		next_capture_at : deserializeDate,
		canceled_at : deserializeDate,
		offer : function(json) {
			return deserializePaymillObject(json, Offer);
		},
		payment : function(json) {
			return deserializePaymillObject(json, Payment);
		},
		client : function(json) {
			return deserializePaymillObject(json, Client);
		},
        interval : function(json) {
            return deserializePaymillObject(json, Interval);
        },
        period_of_validity : function(json) {
            return deserializePaymillObject(json, Interval);
        }
	};
};

Subscription.prototype.getUpdateableFields = function() {
	return [ 'currency', 'name', 'interval', 'payment' ];
};

/**
 * Specify an order for clients.
 * @class Subscription.Order
 * @memberof Subscription
 * @extends Order
 */
Subscription.Order = function() {
	Order.call(this);
};
Subscription.Order.prototype = new Order();
Subscription.Order.constructor = Subscription.Order;

/**
 * @returns {Order} order by offer
 * @memberof Subscription.Order
 */
Subscription.Order.offer = function() {
	var order = new Subscription.Order();
	order.type = "offer";
	return order;
};
/**
 * @returns {Order} order by canceled_at
 * @memberof Subscription.Order
 */
Subscription.Order.canceled_at = function() {
	var order = new Subscription.Order();
	order.type = "canceled_at";
	return order;
};
/**
 * @returns {Order} order by created_at
 * @memberof Subscription.Order
 */
Subscription.Order.created_at = function() {
	var order = new Subscription.Order();
	order.type = "created_at";
	return order;
};

/**
 * Specify a filter for subscriptions.
 * @class Subscription.Filter
 * @memberof Subscription
 * @extends Filter
 */

Subscription.Filter = function() {
	Filter.call(this);
};
Subscription.Filter.prototype = new Filter();
Subscription.Filter.constructor = Subscription.Filter;

/**
 * Add filtering by offer
 * @param {(string|Offer)} offer the offer object or its id.
 * @returns {Filter} the same filter.
 * @memberof Subscription.Filter
 */
Subscription.Filter.prototype.offer = function(offer) {
	this.offer = getIdFromObject(offer);
	return this;
};
/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Subscription.Filter
 */
Subscription.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};

/**
 * The {@link Subscription} object.
 */
exports.Subscription = Subscription;

/**
 *
 * Creates a new SubscriptionCount.
 * @class SubscriptionCount
 * @extends PaymillObject
 * @classdesc How many subscriptions use this offer?
 */
function SubscriptionCount() {

}

SubscriptionCount.prototype = new PaymillObject();
SubscriptionCount.prototype.constructor = SubscriptionCount;
/**
 * Count of active subscriptions. Number as string, or 0 as number for zero.
 * @type {(string|number)}
 * @memberof SubscriptionCount.prototype
 */
SubscriptionCount.prototype.active = null;
/**
 * Count of active subscriptions.Number as string, or 0 as number for zero.
 * @type {(string|number)}
 * @memberof SubscriptionCount.prototype
 */
SubscriptionCount.prototype.inactive = null;
/**
 *
 * Creates a new Transaction. Generally you should never create a PAYMILL object on your own.
 * @class Transaction
 * @classdesc A transaction is the charging of a credit card or a direct debit. In this case you need a new transaction object with either a valid token, payment, client + payment or preauthorization. Every transaction has a unique identifier which will be generated by Paymill to identify every transaction. You can issue/create, list and display transactions in detail. Refunds can be done in an extra entity.
 */

function Transaction() {

}

Transaction.prototype = new PaymillObject();
Transaction.prototype.constructor = Transaction;

/**
 * Unique identifier for this transaction.
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.id = null;

/**
 * Formatted amount of this transaction
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.amount = null;

/**
 * The used amount, smallest possible unit per currency (for euro, we're calculating the amount in cents).
 * @type {number}
 * @memberof Transaction.prototype
 */
Transaction.prototype.origin_amount = null;

/**
 * ISO 4217 formatted currency code.
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.currency = null;

/**
 * Indicates the current status of this transaction, e.g closed means the transaction is sucessfully transfered, refunded means that the amount is fully or in parts refunded.
 * ISO 4217 formatted currency code.
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.status = null;
/**
 * Need a additional description for this transaction? Maybe your shopping cart ID or something like that?
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.description = null;
/**
 * Whether this transaction was issued while being in live mode or not.
 * @type {boolean}
 * @memberof Transaction.prototype
 */
Transaction.prototype.livemode = null;
/**
 * List of refunds.
 * @type {Array.<Refund>}
 * @memberof Transaction.prototype
 */
Transaction.prototype.refunds = null;

/**
 * Corresponding payment object.
 * @type {Payment}
 * @memberof Transaction.prototype
 */
Transaction.prototype.payment = null;

/**
 * Corresponding Client object.
 * @type {Client}
 * @memberof Transaction.prototype
 */
Transaction.prototype.client = null;

/**
 * Corresponding Preauthorization object.
 * @type {Preauthorization}
 * @memberof Transaction.prototype
 */
Transaction.prototype.preauthorization = null;

/**
 * Unix-Timestamp for the creation date.
 * @type {Date}
 * @memberof Transaction.prototype
 */
Transaction.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Transaction.prototype
 */
Transaction.prototype.updated_at = null;

/**
 * Response code
 * @type {number}
 * @memberof Transaction.prototype
 */
Transaction.prototype.response_code = null;
/**
 * Unique identifier of this transaction provided to the acquirer for the statements.
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.short_id = null;

/**
 * PAYMILL invoice where the transaction fees are charged or null.
 * @type {Array.<string>}
 * @memberof Transaction.prototype
 */
Transaction.prototype.invoices = null;
/**
 * App fees
 * @type {Array.<Fee>}
 * @memberof Transaction.prototype
 */
Transaction.prototype.fees = null;

/**
 * App (ID) that created this transaction or null if created by yourself.
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.app_id = null;

/**
 * Whether or not this transaction is refundable
 * @type {boolean}
 * @memberof Transaction.prototype
 */
Transaction.prototype.is_refundable = null;

/**
 * Whether or not this transaction can be marked as fraud
 * @type {boolean}
 * @memberof Transaction.prototype
 */
Transaction.prototype.is_markable_as_fraud = null;


/**
 * SEPA mandate reference, can be optionally specified for direct debit transactions.
 * If specified for other payment methods, it has no effect but must still be valid.
 * If specified, the string must not be empty, can be up to 35 characters long and may contain:<br />
 * <p>
 * <ul>
 * <li>digits 0-9
 * <li>letters a-z A-Z
 * <li>special characters: ‘ , . : + - / ( ) ?
 * <ul>
 * @type {string}
 * @memberof Transaction.prototype
 */
Transaction.prototype.mandate_reference = null;


/**
 * Status of a Transaction.
 * @memberof Transaction
 * @property {string} OPEN
 * @property {string} PENDING
 * @property {string} CLOSED
 * @property {string} FAILED
 * @property {string} PARTIAL_REFUNDED
 * @property {string} REFUNDED
 * @property {string} PREAUTHORIZE
 */
Transaction.Status = {
	"OPEN" : "open",
	"PENDING" : "pending",
	"CLOSED" : "closed",
	"FAILED" : "failed",
	"PARTIAL_REFUNDED" : "partial_refunded",
	"REFUNDED" : "refunded",
	"PREAUTHORIZE" : "preauthorize",
	"PREAUTH" : "preauth"
};
Transaction.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate,
		fees : function(json) {
			return deserializePaymillObjectList(json, Fee);
		},
		client : function(json) {
			return deserializePaymillObject(json, Client);
		},
		payment : function(json) {
			return deserializePaymillObject(json, Payment);
		},
		preauthorization : function(json) {
			return deserializePaymillObject(json, Preauthorization);
		},
		refunds : function(json) {
			return deserializePaymillObjectList(json, Refund);
		}
	};
};
/**
 * Get an end user friendly message for the transaction reponse code
 * @returns {string} an end user friendly message.
 */
Transaction.prototype.getResponseCodeDetail = function()  {
    if ( this.response_code === undefined || this.response_code === null || this.response_code === 10001 ) {
        return "General undefined response";
    } else if( this.response_code === 10002 ) {
        return "Still waiting on something.";
    } else if( this.response_code === 20000 ) {
        return "General success response.";
    } else if( this.response_code === 40000 ) {
        return "General problem with data.";
    } else if( this.response_code === 40001 ) {
        return "General problem with payment data.";
    } else if( this.response_code === 40100 ) {
        return "Problem with credit card data.";
    } else if( this.response_code === 40101 ) {
        return "Problem with cvv.";
    } else if( this.response_code === 40102 ) {
        return "Card expired or not yet valid.";
    } else if( this.response_code === 40103 ) {
        return "Limit exceeded.";
    } else if( this.response_code === 40104 ) {
        return "Card invalid.";
    } else if( this.response_code === 40105 ) {
        return "Expiry date not valid.";
    } else if( this.response_code === 40106 ) {
        return "Credit card brand required.";
    } else if( this.response_code === 40200 ) {
        return "Problem with bank account data.";
    } else if( this.response_code === 40201 ) {
        return "Bank account data combination mismatch.";
    } else if( this.response_code === 40202 ) {
        return "User authentication failed.";
    } else if( this.response_code === 40300 ) {
        return "Problem with 3d secure data.";
    } else if( this.response_code === 40301 ) {
        return "Currency / amount mismatch";
    } else if( this.response_code === 40400 ) {
        return "Problem with input data.";
    } else if( this.response_code === 40401 ) {
        return "Amount too low or zero.";
    } else if( this.response_code === 40402 ) {
        return "Usage field too long.";
    } else if( this.response_code === 40403 ) {
        return "Currency not allowed.";
    } else if( this.response_code === 50000 ) {
        return "General problem with backend.";
    } else if( this.response_code === 50001 ) {
        return "Country blacklisted.";
    } else if( this.response_code === 50002 ) {
        return "IP address blacklisted.";
    } else if( this.response_code === 50003 ) {
        return "Anonymous IP proxy used.";
    } else if( this.response_code === 50100 ) {
        return "Technical error with credit card.";
    } else if( this.response_code === 50101 ) {
        return "Error limit exceeded.";
    } else if( this.response_code === 50102 ) {
        return "Card declined by authorization system.";
    } else if( this.response_code === 50103 ) {
        return "Manipulation or stolen card.";
    } else if( this.response_code === 50104 ) {
        return "Card restricted.";
    } else if( this.response_code === 50105 ) {
        return "Invalid card configuration data.";
    } else if( this.response_code === 50200 ) {
        return "Technical error with bank account.";
    } else if( this.response_code === 50201 ) {
        return "Card blacklisted.";
    } else if( this.response_code === 50300 ) {
        return "Technical error with 3D secure.";
    } else if( this.response_code === 50400 ) {
        return "Decline because of risk issues.";
    } else if( this.response_code === 50500 ) {
        return "General timeout.";
    } else if( this.response_code === 50501 ) {
        return "Timeout on side of the acquirer.";
    } else if( this.response_code === 50502 ) {
        return "Risk management transaction timeout.";
    } else if( this.response_code === 50600 ) {
        return "Duplicate transaction.";
    } else {
        return null;
    }
};
Transaction.prototype.getUpdateableFields = function() {
	return ["description"];
};
/**
 * Specify an order for transactions.
 * @class Transaction.Order
 * @memberof Transaction
 * @extends Order
 */
Transaction.Order = function() {
	Order.call(this);
};
Transaction.Order.prototype = new Order();
Transaction.Order.constructor = Transaction.Order;

/**
 * @returns {Order} order by created_at
 * @memberof Transaction.Order
 */
Transaction.Order.created_at = function() {
	var order = new Transaction.Order();
	order.type = "created_at";
	return order;
};
/**
 * Specify a filter for clients.
 * @class Transaction.Filter
 * @memberof Transaction
 * @extends Filter
 */

Transaction.Filter = function() {
	Filter.call(this);
};
Transaction.Filter.prototype = new Filter();
Transaction.Filter.constructor = Transaction.Filter;

/**
 * Add filtering by payment
 * @param {(string|Client)} client the client object or its id.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.client = function(client) {
	this.client = getIdFromObject(client);
	return this;
};
/**
 * Add filtering by payment
 * @param {(string|Payment)} payment the payment object or its id.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.payment = function(payment) {
	this.payment = getIdFromObject(payment);
	return this;
};
/**
 * Add filtering by amount. e.g. "300" or ">300" or "<300"
 * @param {(string|number)} amount the target amount
 * @param {(string|Filter.EQUALITY)} equality equality for the filter. If none is specified EQUAL is used.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.amount = function(amount, equality) {
    this.amount = getRealEquality(equality) + amount;
    return this;
};
/**
 * Add filtering by description
 * @param {string} description the description
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.description = function(description) {
	this.description = description;
	return this;
};

/**
 * Add filtering by created_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.created_at = function(from, to) {
	this.created_at = getTimeFilter(from,to);
	return this;
};
/**
 * Add filtering by updated_at
 * @param {(number|Date)} from the start date of the filter, either as Date or Unix-time number.
 * @param {(number|Date)} to the end date of the filter, either as Date or Unix-time number.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.updated_at = function(from, to) {
	this.updated_at = getTimeFilter(from,to);
	return this;
};

/**
 * Add filtering by status
 * @param {(string|Transaction.Status)} status the status to be filtered.
 * @returns {Filter} the same filter.
 * @memberof Transaction.Filter
 */
Transaction.Filter.prototype.status = function(status) {
	if (!__.isString) {
		throw new PMError(PMError.Type.WRONG_PARAMS, "status must be a string.");
	}
	this.status = status;
	return this;
};

/**
 * The {@link Transaction} object.
 */
exports.Transaction = Transaction;

/**
 *
 * Creates a new Webhook. Generally you should never create a PAYMILL object on your own.
 * @class Webhook
 * @extends PaymillObject
 * @classdesc With webhooks we give you the possibility to react automatically to certain events which happen within our system. A webhook is basically a URL where we send an HTTP POST request to, every time one of the events attached to that webhook is triggered. Alternatively you can define an email address where we send the event's information to You can manage your webhooks via the API as explained below or you can use the web interface inside our cockpit.<br/>Our call to the webhook / email includes a JSON encoded event object with detailed information about the event in it's POST body.
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

function PaymillService() {

}

PaymillService.prototype.handler = null;
PaymillService.prototype.getPaymillObject = function() {
	throw new PMError(PMError.Type._, "PaymillService.getPaymillObject() is abstract! Did you initialze?");
};
PaymillService.prototype.getEndpointPath = function() {
	throw new PMError(PMError.Type._, "PaymillService.getEndpointPath() is abstract! Did you initialze?");
};
PaymillService.prototype.setHandler = function(handler) {
    this.handler = handler;
};

PaymillService.prototype._create = function(paramMap, type, cb) {
	try {
		var result = new type.prototype.constructor();
		var httpRequest = new HttpRequest(this.getEndpointPath(), "POST", paramMap);
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			result.fromJson(allData.data);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};

PaymillService.prototype._detail = function(obj, cb) {
	try {
        var result = getRefreshObject(obj,this.getPaymillObject());
		var httpRequest = new HttpRequest(this.getEndpointPath() + "/" + result.id, "GET");
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			result.fromJson(allData.data);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};
PaymillService.prototype._update = function(obj, cb) {
    if (! (obj instanceof this.getPaymillObject())) {
        return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "Incorrect object type for update(), must be " + this.getPaymillObject()));
    }
    return this._updateWithMap(obj,obj.getUpdateMap(),cb);
};
PaymillService.prototype._updateWithMap = function(obj,map,cb) {

    try {
        var result = getRefreshObject(obj,this.getPaymillObject());
        var httpRequest = new HttpRequest(this.getEndpointPath() + "/" + result.id, "PUT", map);
        return this._request(httpRequest, function(httpData) {
            var allData = JSON.parse(httpData);
            result.fromJson(allData.data);
            return result;
        }, cb);
    } catch(e) {
        return this._reject(e, cb);
    }
};

PaymillService.prototype._list = function(count, offset, filter, order, cb) {
	try {
		var pmType = this.getPaymillObject();
		var paramMap = {
		};
		if (count) {
			paramMap.count = count;
		}
		if (offset) {
			paramMap.offset = offset;
		}
		if (order) {
			__.extend(paramMap, order.toHttpMap());
		}
		if (filter) {
			__.extend(paramMap, filter);
		}
		var httpRequest = new HttpRequest(this.getEndpointPath(), "GET", paramMap);
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			var result = new PaymillList();
			result.count = allData.data_count;
			result.items = deserializePaymillObjectList(allData.data, pmType);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};

PaymillService.prototype._remove = function(obj, cb) {
    return this._removeWithMap(obj,null,cb);
};

PaymillService.prototype._removeWithMap = function(obj, params, cb) {
    try {
        var pmType = this.getPaymillObject();
        var path = this.getEndpointPath();
        var id = getIdFromObject(obj, pmType);
        var result;
        if ( obj instanceof pmType) {
            result = obj;
        } else {
            result = new pmType.prototype.constructor();
        }
        var httpRequest = new HttpRequest(path + "/" + id, "DELETE", params);
        return this._request(httpRequest, function(httpData) {
            var allData = JSON.parse(httpData);
            result.fromJson(allData.data);
            return result;
        }, cb);
    } catch(e) {
        return this._reject(e, cb);
    }
};

PaymillService.prototype._request = function(httpRequest, httpDataHandler, cb) {
	var defer = this.handler.getDeferedObject();
	var promise = this.handler.getPromiseObject(defer);
	promise = this.handler.includeCallbackInPromise(promise, cb);
    this.handler.httpRequest(httpRequest).then(function(httpData) {
		try {
			var result = httpDataHandler(httpData);
			defer.resolve(result);
		} catch(e) {
			defer.reject(e);
		}
	}, function(error) {
		defer.reject(error);
	});
	return promise;
};
PaymillService.prototype._reject = function(error, cb) {
	var defer = this.handler.getDeferedObject();
	var promise = this.handler.getPromiseObject(defer);
	promise = this.handler.includeCallbackInPromise(promise, cb);
	defer.reject(error);
	return promise;
};

/**
 *
 * Creates a new ClientService. Generally you should never create a PAYMILL service on your own. Instead use the exported "clients".
 * @class ClientService
 */
function ClientService() {

}

ClientService.prototype = new PaymillService();
ClientService.prototype.constructor = ClientService;
ClientService.prototype.getPaymillObject = function() {
	return Client;
};
ClientService.prototype.getEndpointPath = function() {
	return "/clients";
};

/**
 * This function creates a client object.
 * @param {string} [email] email address of the client, is optional if the transaction creates an user itself.
 * @param {string} [description] description for the client.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.create = function(email, description, cb) {
    try {
        var map = {
        };
        if (email) {
            validateString(email,"email",true);
            map.email = email;
        }
        if (description) {
            validateString(description,"description",true);
            map.description = description;
        }
        return this._create(map, Client, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List clients.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Client.Filter|null)} [filter] a list filter or null.
 * @param {(Client.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Client.
 * @param {Client} obj a client object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Client.
 * @param {(string|Client)} obj a client object or its id. note, if you set a client object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

/**
 * Update an Client.
 * @param {(string|Client)} obj a Client object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
ClientService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};
/**
 *
 * Creates a new OfferService. Generally you should never create a PAYMILL service on your own. Instead use the exported "offers".
 * @class OfferService
 */
function OfferService() {

}

OfferService.prototype = new PaymillService();
OfferService.prototype.constructor = OfferService;
OfferService.prototype.getPaymillObject = function() {
	return Offer;
};
OfferService.prototype.getEndpointPath = function() {
	return "/offers";
};

/**
 * This function creates a Offer object.
 * @param {string|number} amount Amount (in cents).
 * @param {string} currency ISO 4217 formatted currency code
 * @param {string|Interval} interval Defining how often the client should be charged. Format: number DAY|WEEK|MONTH|YEAR Example: 2 DAY
 * @param {string} name Your name for this offer
 * @param {number} [trial_period_days] Give it a try or charge directly? Default is 0
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.create = function(amount, currency, interval, name, trial_period_days, cb) {
    try {
        validateNumber(amount,"amount",false);
        validateString(currency,"currency",false);
        validateString(name,"name",false);
        validateMandatory(interval,"interval");
        var map = {
            amount : amount,
            currency : currency,
            interval : interval.toString(),
            name : name
        };
        if (trial_period_days) {
            validateNumber(trial_period_days,"trial_period_days",false);
            map.trial_period_days = trial_period_days;
        }
        return this._create(map, Offer, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List Offers.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Offer.Filter|null)} [filter] a list filter or null.
 * @param {(Offer.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove an Offer.
 * @param {Offer} obj a Offer object or its id.
 * @param {boolean} removeWithSubscriptions if true, the plan and all subscriptions associated with it will be deleted. If false, only the plan will be deleted.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.remove = function(obj, removeWithSubscriptions, cb) {
    validateBoolean(removeWithSubscriptions,'removeWithSubscriptions',false);
    var map =  {
        "remove_with_subscriptions": removeWithSubscriptions
    };
    return this._removeWithMap(obj, map, cb);
};

/**
 * Get an Offer.
 * @param {(string|Offer)} obj a Offer object or its id. note, if you set a Offer object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

/**
 * Update an Offer.
 * @param {(string|Offer)} obj a Offer object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
OfferService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};

/**
 *
 * Creates a new PaymentService. Generally you should never create a PAYMILL service on your own. Instead use the exported "payments".
 * @class PaymentService
 */
function PaymentService() {

}

PaymentService.prototype = new PaymillService();
PaymentService.prototype.constructor = PaymentService;
PaymentService.prototype.getPaymillObject = function() {
	return Payment;
};
PaymentService.prototype.getEndpointPath = function() {
	return "/payments";
};

/**
 * Create a Payment with a token.
 * @param {string} token the payment token, generated by the PAYMILL bridge.
 * @param {(string|Client)} [client] the identifier of a client or a client.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.create = function(token, client, cb) {
    try {
        validateString(token,"token",false);
        var map = {
            token : token
        };
        if (!(__.isEmpty(client))) {
            map.client = getIdFromObject(client, Client);
        }
        return this._create(map, Payment, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List Payments.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Payment.Filter|null)} [filter] a list filter or null.
 * @param {(Payment.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Payment.
 * @param {Payment} obj a payment object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Payment.
 * @param {(string|Payment)} obj a payment object or its id. note, if you set a payment object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Payment or rejected with a PMError.
 * @memberOf PaymentService
 */
PaymentService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};


/**
 *
 * Creates a new PreauthorizationService. Generally you should never create a PAYMILL service on your own. Instead use the exported "preauthorizations".
 * @class PreauthorizationService
 */
function PreauthorizationService() {

}

PreauthorizationService.prototype = new PaymillService();
PreauthorizationService.prototype.constructor = PreauthorizationService;
PreauthorizationService.prototype.getPaymillObject = function() {
	return Preauthorization;
};
PreauthorizationService.prototype.getEndpointPath = function() {
	return "/preauthorizations";
};

PreauthorizationService.prototype._createPreauthorization = function(map, amount, currency, description, cb) {

    validateNumber(amount,"amount",false);
    validateString(currency,"currency",false);
	map.amount = amount;
    map.currency = currency;
    map.description = description;
	map.source = getSourceIdentifier();
	return this._create(map, Preauthorization, cb);
};

/**
 * Create a preauthorization with a token.
 * @param {string} token the payment token, generated by the PAYMILL bridge.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} description  A short description for the preauthorization.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Preauthorization or rejected with a PMError. The actual preauthorization is in the transaction member "preauthorization".
 * @memberOf PreauthorizationService
 */
PreauthorizationService.prototype.createWithToken = function(token, amount, currency, description, cb) {
	try {

        validateString(token,"token",false);
		var map = {
			"token" : token
		};
		return this._createPreauthorization(map, amount, currency, description, cb);
	} catch(e) {
		return this._reject(e);
	}
};
/**
 * Create a preauthorization with a payment object.
 * @param {(string|Payment)} payment the payment object for the preauthorization or its id.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} description  A short description for the preauthorization.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Preauthorization or rejected with a PMError. The actual preauthorization is in the transaction member "preauthorization".
 * @memberOf PreauthorizationService
 */
PreauthorizationService.prototype.createWithPayment = function(payment, amount, currency, description, cb) {
	try {
		var id = getIdFromObject(payment, Payment);
		var map = {
			"payment" : id
		};
		return this._createPreauthorization(map, amount, currency, description, cb);
	} catch(e) {
		return this._reject(e);
	}
};
/**
 * List preauthorizations.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Preauthorization.Filter|null)} [filter] a list filter or null.
 * @param {(Preauthorization.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf PreauthorizationService
 */
PreauthorizationService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a preauthorization.
 * @param {Preauthorization} obj a preauthorization object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Preauthorization or rejected with a PMError.
 * @memberOf PreauthorizationService
 */
PreauthorizationService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a preauthorization.
 * @param {(string|Preauthorization)} obj a preauthorization object or its id. note, if you set a preauthorization object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Preauthorization or rejected with a PMError.
 * @memberOf PreauthorizationService
 */
PreauthorizationService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

/**
 *
 * Creates a new RefundService. Generally you should never create a PAYMILL service on your own. Instead use the exported "refunds". To refund transactions, use the transaction service.
 * @class RefundService
 */
function RefundService() {

}

RefundService.prototype = new PaymillService();
RefundService.prototype.constructor = RefundService;
RefundService.prototype.getPaymillObject = function() {
	return Refund;
};
RefundService.prototype.getEndpointPath = function() {
	return "/refunds";
};

/**
 * List refunds.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Refund.Filter|null)} [filter] a list filter or null.
 * @param {(Refund.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf RefundService
 */
RefundService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Get a Refund.
 * @param {(string|Refund)} obj a client object or its id. note, if you set a client object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Refund or rejected with a PMError.
 * @memberOf RefundService
 */
RefundService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};
/**
 *
 * Creates a new SubscriptionService. Generally you should never create a PAYMILL service on your own. Instead use the exported "subscriptions".
 * @class SubscriptionService
 */
function SubscriptionService() {

}

SubscriptionService.prototype = new PaymillService();
SubscriptionService.prototype.constructor = SubscriptionService;
SubscriptionService.prototype.getPaymillObject = function() {
	return Subscription;
};
SubscriptionService.prototype.getEndpointPath = function() {
	return "/subscriptions";
};

/**
 * Create a subscription with payment and offer. Chain further values by calling with..() functions and finish by calling create().
 *
 * @param {(string|Offer)} offer an offer object or its id.
 * @param {(string|Payment)} payment a payment object or its id.
 * @return {SubscriptionService.Creator} a creator. when configured please call create()
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.fromOffer = function(payment,offer) {
    var creator = new SubscriptionService.Creator(this);
    creator.payment = payment;
    creator.offer = offer;
    return creator;
};

SubscriptionService.prototype.fromParams = function(payment, amount, currency, interval) {
    var creator = new SubscriptionService.Creator(this);
    creator.payment = payment;
    creator.amount = amount;
    creator.currency = currency;
    creator.interval = interval;
    return creator;
};

/**
 * This function creates a Subscription between a Client and an Offer. A Client can have several Subscriptions to different Offers, but only one Subscription to the same Offer. The Clients is charged for each billing interval entered.
 * <strong>NOTE</strong>As the Subscription create method has a lot of options, we recommend you to use a Subscription.Creator.
 * @param {(string|Offer)} offer an offer object or its id.
 * @param {(string|Payment)} payment a payment object or its id.
 * @param {(string|Client)} client the identifier of a client or a client. If not provided the client from the payment is being used.
 * @param {(string|number|Date)} start_at Unix-Timestamp for the subscription start date, if trial_end > start_at, the trial_end will be set to start_at
 * @param {(string|number)} amount the amount of the subscription in cents
 * @param {(string)} currency ISO 4217 formatted currency code startAt
 * @param {(string|Interval)} interval define how often the client should be charged.
 * @param {(string|Interval)} periodOfValidity limits the validity of the subscription
 * @param {string} mandate_reference a mandate reference
 * @param {(string)} name name of the subscription
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.createWithAll = function(payment, client, offer, amount, currency, interval, startAt,
    name,periodOfValidity, mandate_reference, cb) {
	try {
		var map = {};
        map.payment = getIdFromObject(payment, Payment);
        if (!__.isEmpty(client)) {
            map.client = getIdFromObject(client, Client);
        }
        if (!__.isEmpty(offer)) {
            map.offer = getIdFromObject(offer, Offer);
        }
        if (__.isNumber(amount)) {
            map.amount = amount;
        }
        if (!__.isEmpty(currency)) {
            map.currency = currency;
        }
        if (!__.isEmpty(interval)) {
            map.interval = interval.toString();
        }
        if (startAt) {
            map.start_at = getUnixTimeFromParam(startAt,"startAt");
        }
        if (!__.isEmpty(name)) {
            map.name = name;
        }
				if (!__.isEmpty(mandate_reference)) {
						map.mandate_reference = mandate_reference;
				}
        if (!__.isEmpty(periodOfValidity)) {
            map.period_of_validity = periodOfValidity.toString();
        }
		return this._create(map, Subscription, cb);
	} catch (e) {
		return this._reject(e);
	}
};

/**
 * List Subscriptions.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Subscription.Filter|null)} [filter] a list filter or null.
 * @param {(Subscription.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Subscription. f you set the attribute cancel_at_period_end parameter to the value true, the subscription will remain active until the end of the period. The subscription will not be renewed again. If the value is set to false it is directly terminated but pending transactions will still be charged.
 * @param {Subscription} obj a Subscription object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Temporary pauses a subscription. <br />
 * <strong>NOTE</strong><br />
 * Pausing is permitted until one day (24 hours) before the next charge date.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.pause = function(obj, cb) {
    var map = { "pause" : true };
	return this._updateWithMap(obj, map, cb);
};

/**
 * Unpauses a subscription. Next charge will occur according to the defined interval.<br />
 * <strong>NOTE</strong><br />
 * if the nextCaptureAt is the date of reactivation: a charge will happen<br />
 * if the next_capture_at is in the past: it will be set to: reactivationdate + interval <br/>
 * <br />
 * <strong>IMPORTANT</strong><br />
 * An inactive subscription can reactivated within 13 month from the date of pausing. After this period, the subscription will
 * expire and cannot be re-activated.<br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.unpause = function(obj, cb) {
    var map = { "pause" : true };
    return this._updateWithMap(obj, map, cb);
};

/**
 * Changes the amount of a subscription. The new amount is valid until the end of the subscription. If you want to set a
 * temporary one-time amount use changeAmountTemporary().
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number)} amount the new amount.
 * @param {(string)} [currency] optionally, a new currency.
 * @param {(string|Interval)} [interval] optionally, a new interval.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeAmount = function(obj, amount, currency, interval, cb) {
    return this._changeAmount(obj, amount, 1, currency, interval, cb);
};

/**
 * Changes the amount of a subscription. The new amount is valid one-time only after which the original subscription amount will
 * be charged again. If you want to permanently change the amount use changeAmount()
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number)} amount the new amount.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeAmountTemporary = function(obj, amount, cb) {
    return this._changeAmount(obj, amount, 0, false, false, cb);
};

SubscriptionService.prototype._changeAmount = function(obj, amount, type, currency, interval, cb) {
    var map = {
        "amount_change_type" : type
    };
    validateNumber(amount,"amount",false);
    map.amount = amount;
    if (currency) {
        validateString(currency,"currency",true);
        map.currency = currency;
    }
    if (interval) {
        map.interval = interval.toString();
    }
    return this._updateWithMap(obj, map, cb);
};
/**
 * Change the offer of a subscription. <br />
 * The plan will be changed immediately. The next_capture_at will change to the current date (immediately). A refund will be
 * given if due. <br />
 * If the new amount is higher than the old one, a pro-rata charge will occur. The next charge date is immediate i.e. the
 * current date. If the new amount is less then the old one, a pro-rata refund will occur. The next charge date is immediate
 * i.e. the current date. <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferChangeCaptureDateAndRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 2,cb);
};

/**
 * Change the offer of a subscription. <br />
 * The plan will be changed immediately. The next_capture_at will change to the current date (immediately). A refund will be
 * given if due. <br />
 * If the new amount is higher than the old one, a pro-rata charge will occur. The next charge date is immediate i.e. the
 * current date. If the new amount is less then the old one, a pro-rata refund will occur. The next charge date is immediate
 * i.e. the current date. <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferKeepCaptureDateAndRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 1, cb);
};

/**
 * Change the offer of a subscription. <br />
 * the plan will be changed immediately. The next_capture_at date will remain unchanged. No refund will be given <br />
 * <strong>IMPORTANT</strong><br />
 * Permitted up only until one day (24 hours) before the next charge date. <br />
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Offer)} offer a new offer or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.changeOfferKeepCaptureDateNoRefund = function(obj, offer, cb) {
    return this._changeOffer(obj, offer, 0, cb);
};


SubscriptionService.prototype._changeOffer = function(obj, offer, type, cb) {
    var map = {
        "offer_change_type" : type
    };
    map.offer = getIdFromObject(offer, Offer);
    return this._updateWithMap(obj, map, cb);
};

/**
 * Stop the trial period of a subscription and charge immediately.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.endTrial = function(obj, cb) {
    var map = {
        "trial_end" : false
    };
    return this._updateWithMap(obj, map, cb);
};

/**
 * Stop the trial period of a subscription on a specific date.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|number|Date)} date the date, on which the subscription should end.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.endTrialAt = function(obj, date, cb) {
    var map = {};
    try {
        map.trial_end = getUnixTimeFromParam(date,"date");
        return this._updateWithMap(obj, map, cb);
    } catch (e) {
        return this._reject(e);
    }

};

/**
 * Change the period of validity for a subscription.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {(string|Interval)} newValidity the new validity.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.limitValidity = function(obj, newValidity, cb) {
    var map = {};
    try {
        if (__.isEmpty(newValidity)) {
            throw new PMError(PMError.Type.WRONG_PARAMS, "newValidity must be a an interval");
        }
        map.period_of_validity = newValidity.toString();
        return this._updateWithMap(obj, map, cb);
    } catch (e) {
        return this._reject(e);
    }

};

/**
 * Change the validity of a subscription to unlimited
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.unlimitValidity = function(obj, cb) {
    var map = {
        "period_of_validity" : "remove"
    };
    return this._updateWithMap(obj, map, cb);
};


/**
 * This function removes an existing subscription. The subscription will be deleted and no pending transactions will be charged.
 * Deleted subscriptions will not be displayed.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.delete = function(obj, cb) {
    var map = { "remove" : true };
    return this._removeWithMap(obj, map, cb);
};

/**
 * This function cancels an existing subscription. The subscription will be directly terminated and no pending transactions will
 * be charged.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.cancel = function(obj, cb) {
    var map = { "remove" : false };
    return this._removeWithMap(obj, map, cb);
};


/**
 * Get a Subscription.
 * @param {(string|Subscription)} obj a Subscription object or its id. note, if you set a Subscription object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.detail = function(obj, cb) {
    return this._detail(obj, cb);
};

/**
 * Updates a subscription.Following fields will be updated:<br />
 * <p>
 * <ul>
 * <li>interval (note, that nextCaptureAt will not change.)
 * <li>currency
 * <li>name
 * <li>payment
 * <ul>
 * <p>
 * To update further properties of a subscription use following methods:<br />
 * <p>
 * <ul>
 * <li>cancel() to cancel.
 * <li>changeAmount() to change the amount.
 * <li>changeOfferChangeCaptureDateAndRefund() to change the offer.
 * <li>changeOfferKeepCaptureDateAndRefund() to change the offer.
 * <li>changeOfferKeepCaptureDateNoRefund() to change the offer.
 * <li>endTrial() to end the trial
 * <li>limitValidity() to change the validity.
 * <li>pause() to pause
 * <li>unlimitValidity() to change the validity.
 * <li>unpause() to unpause.
 * <ul>
 * <p>
 * @param {Subscription} obj a Subscription object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Subscription or rejected with a PMError.
 * @memberOf SubscriptionService
 */
SubscriptionService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};

/**
 * A helper for the complex creation method
 * @class SubscriptionService.Creator
 * @memberof SubscriptionService
 */
SubscriptionService.Creator = function(service) {
    this.service = service;
};

SubscriptionService.Creator.prototype.service = null;
SubscriptionService.Creator.prototype.payment = null;
SubscriptionService.Creator.prototype.client = null;
SubscriptionService.Creator.prototype.offer = null;
SubscriptionService.Creator.prototype.amount = null;
SubscriptionService.Creator.prototype.currency = null;
SubscriptionService.Creator.prototype.interval = null;
SubscriptionService.Creator.prototype.startAt = null;
SubscriptionService.Creator.prototype.name = null;
SubscriptionService.Creator.prototype.periodOfValidity = null;
SubscriptionService.Creator.prototype.mandate_reference = null;


SubscriptionService.Creator.prototype.create = function(cb) {
 return this.service.createWithAll(this.payment,this.client,this.offer,this.amount,this.currency,this.interval,this.startAt,this.name,this.periodOfValidity,cb);
};

SubscriptionService.Creator.prototype.withAmount = function(amount) {
    this.amount = amount;
    return this;
};

SubscriptionService.Creator.prototype.withClient = function(client) {
    this.client = client;
    return this;
};

SubscriptionService.Creator.prototype.withCurrency = function(currency) {
    this.currency = currency;
    return this;
};

SubscriptionService.Creator.prototype.withInterval = function(interval) {
    this.interval = interval;
    return this;
};

SubscriptionService.Creator.prototype.withName = function(name) {
    this.name = name;
    return this;
};

SubscriptionService.Creator.prototype.withOffer = function(offer) {
    this.offer = offer;
    return this;
};

SubscriptionService.Creator.prototype.withPeriodOfValidity = function(periodOfValidity) {
    this.periodOfValidity = periodOfValidity;
    return this;
};

SubscriptionService.Creator.prototype.withStartDate = function(startAt) {
    this.startAt = startAt;
    return this;
};

/**
 * Add a mandate reference
 * @param {string} mandate_reference
 * @return {SubscriptionService.Creator} the same creator
 * @memberOf SubscriptionService.Creator
 */
SubscriptionService.Creator.prototype.withMandateReference = function(mandate_reference) {
    this.mandate_reference = mandate_reference;
    return this;
};

/**
 *
 * Creates a new TransactionService. Generally you should never create a PAYMILL service on your own. Instead use the exported "transactions".
 * @class TransactionService
 */
function TransactionService() {

}

TransactionService.prototype = new PaymillService();
TransactionService.prototype.constructor = TransactionService;
TransactionService.prototype.getPaymillObject = function() {
	return Transaction;
};
TransactionService.prototype.getEndpointPath = function() {
	return "/transactions";
};

TransactionService.prototype._createTransaction = function(map, amount, currency, description, client, fee_amount, fee_payment, fee_currency, cb) {
	validateNumber(amount,"amount",false);
    validateString(currency,"currency",false);
	map.amount = amount;
	map.currency = currency;
	map.description = description;
	try {
		var clientId = getIdFromObject(client, Client);
		map.client = clientId;
	} catch (e) {
		// no client
	}
	if (fee_amount) {
		map.fee_amount = fee_amount;
	}
	if (fee_payment) {
		map.fee_payment = fee_payment;
	}
	if (fee_currency) {
		map.fee_currency = fee_currency;
	}
	map.source = getSourceIdentifier();
	return this._create(map, Transaction, cb);
};

/**
 * Create a transaction with a token.
 * @param {string} token the payment token, generated by the PAYMILL bridge.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} description A short description for the transaction.
 * @param {(string|Client)} [client] the identifier of a client or a client.
 * @param {(number|string)} fee_amount Fee included in the transaction amount (set by a connected app). Mandatory if fee_payment is set.
 * @param {string} fee_payment the identifier of the payment from which the fee will be charged (creditcard-object or directdebit-object). Mandatory if fee_amount is set.
 * @param {string} fee_currency ISO 4217 formatted currency code. If not set, the currency of the transaction is used.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.createWithToken = function(token, amount, currency, description, client, fee_amount, fee_payment, fee_currency, cb) {
	try {
		validateString(token,"token",false);
		var map = {
			"token" : token
		};
		return this._createTransaction(map, amount, currency, description, client, fee_amount, fee_payment, fee_currency, cb);
	} catch(e) {
		return this._reject(e);
	}
};
/**
 * Create a transaction with a payment object.
 * @param {(string|Payment)} payment the payment object for the transaction or its id.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} description A short description for the transaction.
 * @param {(string|Client)} [client] the identifier of a client or a client. When this parameter is used, you have also to specify a payment method which is not assigned to a client yet. If you attempt to use this parameter when creating a transaction and when specifying a token or preauthorization, the specified client will be ignored.
 * @param {(number|string)} fee_amount Fee included in the transaction amount (set by a connected app). Mandatory if fee_payment is set.
 * @param {string} fee_payment the identifier of the payment from which the fee will be charged (creditcard-object or directdebit-object). Mandatory if fee_amount is set.
 * @param {string} fee_currency ISO 4217 formatted currency code. If not set, the currency of the transaction is used.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.createWithPayment = function(payment, amount, currency, description, client, fee_amount, fee_payment, fee_currency, cb) {
	try {
		var id = getIdFromObject(payment, Payment);
		var map = {
			"payment" : id
		};
		return this._createTransaction(map, amount, currency, description, client, fee_amount, fee_payment, cb);
	} catch(e) {
		return this._reject(e);
	}
};
/**
 * Create a transaction with a payment object.
 * @param {(string|Preauthorization)} preauthroization the preauthroization object for the transaction or its id.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @param {string} description A short description for the transaction.
 * @param {(string|Client)} [client] the identifier of a client or a client. When this parameter is used, you have also to specify a payment method which is not assigned to a client yet. If you attempt to use this parameter when creating a transaction and when specifying a token or preauthorization, the specified client will be ignored.
 * @param {(number|string)} fee_amount Fee included in the transaction amount (set by a connected app). Mandatory if fee_payment is set.
 * @param {string} fee_payment the identifier of the payment from which the fee will be charged (creditcard-object or directdebit-object). Mandatory if fee_amount is set.
 * @param {string} fee_currency ISO 4217 formatted currency code. If not set, the currency of the transaction is used.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.createWithPreauthorization = function(preauthroization, amount, currency, description, client, fee_amount, fee_payment, fee_currency, cb) {
	try {
		var id = getIdFromObject(preauthroization, Preauthorization);
		var map = {
			"preauthorization" : id
		};
		return this._createTransaction(map, amount, currency, description, client, fee_amount, fee_payment, cb);
	} catch(e) {
		return this._reject(e);
	}
};

/**
 * This function refunds a transaction that has been created previously and was refunded in parts or wasn't refunded at all. The inserted amount will be refunded to the credit card / direct debit of the original transaction. There will be some fees for the merchant for every refund.
 * @param {(string|Transaction)} transaction the transaction object or its id.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} description additional description for this refund
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Refund or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.refund = function(transaction, amount, description, cb) {
	try {
		validateNumber(amount,"amount",false);
		var id = getIdFromObject(transaction, Transaction);
		var map = {
			"amount" : amount
		};
		if (description) {
			map.description = description;
		}
		var result = new Refund();
		var httpRequest = new HttpRequest("/refunds/" + id, "POST", map);
		return this._request(httpRequest, function(httpData) {
			var allData = JSON.parse(httpData);
			result.fromJson(allData.data);
			return result;
		}, cb);
	} catch(e) {
		return this._reject(e, cb);
	}
};
/**
 * List transactions.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Transaction.Filter|null)} [filter] a list filter or null.
 * @param {(Transaction.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a transaction.
 * @param {Transaction} obj a transaction object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Update a transaction.
 * @param {Transaction} obj a transaction object or its id.Note, if you specify an object, the same object will be updated and returned!
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};

/**
 * Get a transaction.
 * @param {(string|Transaction)} obj a transaction object or its id. note, if you set a transaction object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService
 */
TransactionService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};


/**
 * Create a transaction with a token. Chain further values by calling withXXX()
 * functions and finish by calling create().
 * @param {string} token the payment token, generated by the PAYMILL bridge.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @return {TransactionService.Creator} a creator. when configured, please call create()
 * @memberOf TransactionService
 */
TransactionService.prototype.fromToken = function(token, amount, currency) {
    var creator = new TransactionService.Creator(this);
		validateString(token,"token",false);
		creator.map.token = token;

		validateNumber(amount,"amount",false);
		validateString(currency,"currency",false);
		creator.map.amount = amount;
		creator.map.currency = currency;
		creator.map.description = "";

    return creator;
};

/**
 * Create a transaction with a preauthorization. Chain further values by calling withXXX()
 * functions and finish by calling create().
 * @param {(string|Preauthorization)} preauth the preauthroization object for the transaction or its id.
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @return {TransactionService.Creator} a creator. when configured, please call create()
 * @memberOf TransactionService
 */
TransactionService.prototype.fromPreauth = function(preauth, amount, currency) {
    var creator = new TransactionService.Creator(this);
		creator.map.preauthorization = getIdFromObject(preauth,Preauthorization);

		validateNumber(amount,"amount",false);
		validateString(currency,"currency",false);
		creator.map.amount = amount;
		creator.map.currency = currency;
		creator.map.description = "";

    return creator;
};

/**
 * Create a transaction with a preauthorization. Chain further values by calling withXXX()
 * functions and finish by calling create().
 * @param {(string|Payment)} payment the payment object for the transaction or its id
 * @param {(string|number)} amount amount (in cents) which will be charged.
 * @param {string} currency ISO 4217 formatted currency code.
 * @return {TransactionService.Creator} a creator. when configured, please call create()
 * @memberOf TransactionService
 */
TransactionService.prototype.fromPayment = function(payment, amount, currency) {
    var creator = new TransactionService.Creator(this);
		creator.map.payment = getIdFromObject(payment, Payment);

		validateNumber(amount,"amount",false);
		validateString(currency,"currency",false);
		creator.map.amount = amount;
		creator.map.currency = currency;
		creator.map.description = "";

    return creator;
};

/**
 * A helper for the complex creation method
 * @class TransactionService.Creator
 * @memberof TransactionService
 */
TransactionService.Creator = function(service) {
    this.service = service;
		this.map = {};
};

/**
 * Create a transaction with this creator.
 * @return {Promise} a promise, which will be fulfilled with a Transaction or rejected with a PMError.
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.create = function(cb) {
	return this.service._create(this.map, Transaction, cb);
};

/**
 * Add a description
 * @param {string} description
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withDescription = function(description) {
		validateString(description);
    this.map.description = description;
    return this;
};

/**
 * Add a client
 * @param {(string|Client)} client
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withClient = function(client) {
    this.map.client = getIdFromObject(client);
    return this;
};

/**
 * Add a fee amount
 * @param {(string|Client)} fee_amount
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withFeeAmount = function(fee_amount) {
		validateNumber(fee_amount);
    this.map.fee_amount = fee_amount;
    return this;
};

/**
 * Add a fee payment
 * @param {(string|Client)} client
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withFeePayment = function(fee_payment) {
    this.map.fee_payment = getIdFromObject(fee_payment);
    return this;
};

/**
 * Add a fee currency
 * @param {string} fee_currency
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withFeeCurrency = function(fee_currency) {
    validateString(fee_currency,"fee_currency",false);
    this.map.fee_currency = fee_currency;
    return this;
};

/**
 * Add a mandate reference
 * @param {string} mandate_reference
 * @return {TransactionService.Creator} the same creator
 * @memberOf TransactionService.Creator
 */
TransactionService.Creator.prototype.withMandateReference = function(mandate_reference) {
    validateString(mandate_reference,"mandate_reference",false);
    this.map.mandate_reference = mandate_reference;
    return this;
};

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
 * @param {string} url the url of the webhook
 * @param {Array.<string>} event_types includes a set of webhook event types as strings.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Webhook or rejected with a PMError.
 * @memberOf WebhookService
 */
WebhookService.prototype.createUrl = function(url, event_types, cb) {
    validateString(url,"url",false);
	var map = {
		url : url
	};
	return this._createWithMap(map, event_types, cb);

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
    validateString(email,"email",false);
	var map = {
		email : email
	};
	return this._createWithMap(map, event_types, cb);

};
WebhookService.prototype._createWithMap = function(map, event_types, cb) {
    if (!event_types || !event_types.length || event_types.length < 1) {
        return this._reject(new PMError(PMError.Type.WRONG_PARAMS, "invalid event types. supply a string array with at least 1 type"));

    }
    map.event_types = event_types;
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
 * @memberOf WebhookService
 */
WebhookService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};
