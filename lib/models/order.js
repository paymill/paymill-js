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
