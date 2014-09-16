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
            throw new PMError(PMError.Type.WRONG_PARAMS, obj + " is of correct type ( " + objectType + " ), but has no valid id.");
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