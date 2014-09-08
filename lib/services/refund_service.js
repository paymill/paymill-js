/**
 *
 * Creates a new RefundService. Generally you should never create a PAYMILL service on your own. Instead use the exported "refunds". To refund transactions, use the transaction service.
 * @class RefundService
 */
function RefundService() {

}

RefundService.prototype = new PaymillService();
RefundService.prototype.constructor = RefundService;
RefundService.prototype.getPaymillObject = function() {
	return Refund;
};
RefundService.prototype.getEndpointPath = function() {
	return "/refunds";
};

/**
 * List refunds.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Refund.Filter|null)} [filter] a list filter or null.
 * @param {(Refund.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf RefundService
 */
RefundService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Get a Refund.
 * @param {(string|Refund)} obj a client object or its id. note, if you set a client object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Refund or rejected with a PMError.
 * @memberOf RefundService
 */
RefundService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};