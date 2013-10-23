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
	return new Date(unixTime);
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