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
