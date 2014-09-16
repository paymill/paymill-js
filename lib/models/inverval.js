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