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
 * Fee amount in the smallest currency unit e.g. “420” for 4.20 €
 * @type {number}
 * @memberof Fee.prototype
 */
Fee.prototype.amount = null;

/**
 * Type of a Fee.
 * @memberof Fee
 * @property {string} APPLICATION
 */
Fee.Type = {
	"APPLICATION" : "application"
};
