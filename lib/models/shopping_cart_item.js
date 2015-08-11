/**
 * Creates a new ShoppingCartItem.
 * @class ShoppingCartItem
 * @extends PaymillObject
 * @classdesc A shopping cart item object belongs to exactly one transaction. It represents the merchants item which will be given to paypal.
 */
function ShoppingCartItem() {

}

ShoppingCartItem.prototype = new PaymillObject();
ShoppingCartItem.prototype.constructor = ShoppingCartItem;

/**
 * Item name, max. 127 characters.
 * @type {string}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.name = null;

/**
 * Additional description, max. 127 characters.
 * @type {string}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.description = null;

/**
 * Price > 0 for a single item, including tax. Can also be negative to act as a discount.
 * @type {number}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.amount = null;

/**
 * Quantity of this item.
 * @type {number}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.quantity = null;

/**
 * Item number or other identifier (SKU/EAN), max. 127 characters
 * @type {string}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.item_number = null;

/**
 * URL of the item in your store, max. 2000 characters.
 * @type {string}
 * @memberof ShoppingCartItem.prototype
 */
ShoppingCartItem.prototype.url = null;

/**
 * The {@link ShoppingCartItem} object.
 */
exports.ShoppingCartItem = ShoppingCartItem;
