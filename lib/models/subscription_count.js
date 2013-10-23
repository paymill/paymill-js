/**
 *
 * Creates a new SubscriptionCount.
 * @class SubscriptionCount
 * @extends PaymillObject
 * @classdesc How many subscriptions use this offer?
 */
function SubscriptionCount() {

}

SubscriptionCount.prototype = new PaymillObject();
SubscriptionCount.prototype.constructor = SubscriptionCount;
/**
 * Count of active subscriptions. Number as string, or 0 as number for zero.
 * @type {(string|number)}
 * @memberof SubscriptionCount.prototype
 */
SubscriptionCount.prototype.active = null;
/**
 * Count of active subscriptions.Number as string, or 0 as number for zero.
 * @type {(string|number)}
 * @memberof SubscriptionCount.prototype
 */
SubscriptionCount.prototype.inactive = null;