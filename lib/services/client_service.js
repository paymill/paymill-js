/**
 *
 * Creates a new ClientService. Generally you should never create a PAYMILL service on your own. Instead use the exported "clients".
 * @class ClientService
 */
function ClientService() {

}

ClientService.prototype = new PaymillService();
ClientService.prototype.constructor = ClientService;
ClientService.prototype.getPaymillObject = function() {
	return Client;
};
ClientService.prototype.getEndpointPath = function() {
	return "/clients";
};

/**
 * This function creates a client object.
 * @param {string} [email] email address of the client, is optional if the transaction creates an user itself.
 * @param {string} [description] description for the client.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.create = function(email, description, cb) {
    try {
        var map = {
        };
        if (email) {
            validateString(email,"email",true);
            map.email = email;
        }
        if (description) {
            validateString(description,"description",true);
            map.description = description;
        }
        var path = this.getEndpointPath();
        return this._create(map, Client, cb);
    } catch (e) {
        return this._reject(e);
    }
};

/**
 * List clients.
 * @param {(string|number)} [count] limit of objects to be listed. use for pagination.
 * @param {(string|number)} [offset] offset. use for pagination.
 * @param {(Client.Filter|null)} [filter] a list filter or null.
 * @param {(Client.Order|null)} [order] a list order or null.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a PayMillObjectList or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.list = function(count, offset, filter, order, cb) {
	return this._list(count, offset, filter, order, cb);
};

/**
 * Remove a Client.
 * @param {Client} obj a client object or its id.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.remove = function(obj, cb) {
	return this._remove(obj, cb);
};

/**
 * Get a Client.
 * @param {(string|Client)} obj a client object or its id. note, if you set a client object it will be updated, no new object will be created.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Client or rejected with a PMError.
 * @memberOf ClientService
 */
ClientService.prototype.detail = function(obj, cb) {
	return this._detail(obj, cb);
};

/**
 * Update an Client.
 * @param {(string|Client)} obj a Client object.
 * @param {Object} [cb] a callback.
 * @return {Promise} a promise, which will be fulfilled with a Offer or rejected with a PMError.
 * @memberOf OfferService
 */
ClientService.prototype.update = function(obj, cb) {
	return this._update(obj, cb);
};