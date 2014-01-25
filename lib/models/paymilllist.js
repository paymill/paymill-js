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
