/**
 *
 * Creates a new Address.
 * @class Address
 * @extends PaymillObject
 * @classdesc An address object belongs to exactly one transaction and can represent either its shipping address or billing address. Note, that state and postal_code are mandatory for PayPal transactions in certain countries, please consult PayPal documentation for more details.
 */
function Address() {

}

Address.prototype = new PaymillObject();
Address.prototype.constructor = Address;

/**
 * Street address (incl. street number), max. 100 characters.
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.street_address = null;

/**
 * Addition to street address (e.g. building, floor, or c/o), max. 100 characters.
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.street_address_addition = null;

/**
 * City, max. 40 characters.
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.city = null;

/**
 * State or province, max. 40 characters.
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.state = null;

/**
 * Country-specific postal code, max. 20 characters.
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.postal_code = null;

/**
 * 2-letter country code according to ISO 3166-1 alpha-2
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.country = null;

/**
 * Contact phone number, max. 20 characters
 * @type {string}
 * @memberof Address.prototype
 */
Address.prototype.phone = null;

/**
 * The {@link Address} object.
 */
exports.Address = Address;
