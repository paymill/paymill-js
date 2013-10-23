/**
 *
 * Creates a new OfferInterval.
 * @class OfferInterval
 * @param {number} number for the interval
 * @param {string|OfferInterval.Period} period for the interval
 * @extends PaymillObject
 * @classdesc Defining an interval for an offer.
 */
function OfferInterval(number, period) {
	this.number = number;
	this.period = period;
}

OfferInterval.prototype = new PaymillObject();
OfferInterval.prototype.constructor = OfferInterval;
/**
 * Number for the interval
 * @type {number}
 * @memberof OfferInterval.prototype
 */
OfferInterval.prototype.number = null;
/**
 * Period for the interval
 * @type {OfferInterval.Period}
 * @memberof OfferInterval.prototype
 */
OfferInterval.prototype.period = null;


OfferInterval.prototype.fromJson = function(jsonObj) {
	var split=jsonObj.split(" ");
	this.number=parseInt(split[0],10);
	this.period=split[1];
	this.originalJson = jsonObj;
};
OfferInterval.prototype.toString = function() {
	return ""+this.number+" "+this.period;
};
/**
 * Period for an OfferInterval.
 * @memberof OfferInterval
 * @property {string} DAY
 * @property {string} WEEK
 * @property {string} MONTH
 * @property {string} YEAR
 */
OfferInterval.Period = {
	"DAY" : "DAY",
	"WEEK" : "WEEK",
	"MONTH" : "MONTH",
	"YEAR" : "YEAR"
}; 
exports.OfferInterval=OfferInterval;