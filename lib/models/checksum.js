/**
 *
 * Creates a new payment. Generally you should never create a PAYMILL object on your own.
 * @class Checksum
 * @classdesc Checksum validation is a simple method to ensure the integrity of transferred data. Basically, we generate a hash out of the given parameters and your private API key. If you send us a request with transaction data and the generated checksum, we can easily validate the data. To make the checksum computation as easy as possible we provide this endpoint for you. For transactions that are started client-side, e.g. PayPal checkout, it is required to first create a checksum on your server and then provide that checksum when starting the transaction in the browser. The checksum needs to contain all data required to subsequently create the actual transaction.
 */
function Checksum() {

}

Checksum.prototype = new PaymillObject();
Checksum.prototype.constructor = Checksum;

/**
 * Unique identifier for this checksum.
 * @type {string}
 * @memberof Checksum.prototype
 */
Checksum.prototype.id = null;

/**
 * The type of the checksum. Currently only 'paypal'
 * @type {string}
 * @memberof Checksum.prototype
 */
Checksum.prototype.type = null;

/**
 * The actual checksum.
 * @type {string}
 * @memberof Checksum.prototype
 */
Checksum.prototype.checksum = null;

/**
 * Transaction data.
 * @type {string}
 * @memberof Checksum.prototype
 */
Checksum.prototype.data = null;

Checksum.prototype.created_at = null;
/**
 * Unix-Timestamp for the last update.
 * @type {Date}
 * @memberof Checksum.prototype
 */
Checksum.prototype.updated_at = null;

/**
 * App (ID) that created this checksum or null if created by yourself.
 * @type {string}
 * @memberof Checksum.prototype
 */
Checksum.prototype.app_id = null;

/*
 * special fields
 */
Checksum.prototype.getFieldDefinitions = function() {
	return {
		created_at : deserializeDate,
		updated_at : deserializeDate
	};
};

exports.Checksum = Checksum;
