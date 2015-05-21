![PAYMILL icon](https://static.paymill.com/r/335f99eb3914d517bf392beb1adaf7cccef786b6/img/logo-download_Light.png)
# PAYMILL-JS


[![NPM version](https://badge.fury.io/js/paymill-wrapper.png)](http://badge.fury.io/js/paymill-wrapper)
[![Build Status](https://travis-ci.org/paymill/paymill-js.svg?branch=master)](https://travis-ci.org/paymill/paymill-js)
[![Code Climate](https://codeclimate.com/github/paymill/paymill-js/badges/gpa.svg)](https://codeclimate.com/github/paymill/paymill-js)
[![Test Coverage](https://codeclimate.com/github/paymill/paymill-js/badges/coverage.svg)](https://codeclimate.com/github/paymill/paymill-js)
<br/>
[![Dependency Status](https://david-dm.org/paymill/paymill-js.png)](https://david-dm.org/paymill/paymill-js)
[![devDependency Status](https://david-dm.org/paymill/paymill-js/dev-status.png)](https://david-dm.org/paymill/paymill-js#info=devDependencies)

An universal JavaScript API wrapper. Works with [Node](http://nodejs.org/), [Parse](http://www.parse.com), [apiOmat](http://www.apiomat.com) and potentially any other javascript-based backend.

Please open an issue and let us know if you find any bugs, have a feature request or have successfully integrated it into your project.

## Getting started

- If you are not familiar with PAYMILL, start with the [documentation](https://www.paymill.com/en-gb/documentation-3/).
- Install the latest release.
- Check the API [reference](https://www.paymill.com/en-gb/documentation-3/reference/api-reference/). For code snippets select "JS".
- Check the full JSdoc [documentation](http://paymill.github.io/paymill-js/docs/).
- Check the tests / samples.


## Installation
### Node

Install the package using npm: ``npm install paymill-wrapper`` or ``npm install -g paymill-wrapper`` to install globaly. You can also add ``paymill-wrapper`` to your ``package.json`` dependecies.

Use the module with ``var paymill = require("paymill-wrapper");``.

### Parse

Copy ``paymill.parse.js`` to your your cloud code folder.

Use the module with ``var paymill = require("cloud/paymill.parse.js");``.

### apiOmat

In your [apiOmat](http://www.apiomat.com) dashboard add the Modules 'Paymill' and 'Server Code' to use paymill function in 'Server Code' module.
See [documentation](http://www.apiomat.com/docs/modules/paymill-module/) of the module for further informations.

## Usage

### Initialization 
Before using the wrapper you have to create a [PaymillContext](http://paymill.github.io/paymill-js/docs/PaymillContext.html) using your private PAYMILL key: ``paymill.getContext(yourApiKey);``.

### Services

Each endpoint of the PAYMILL [API](https://www.paymill.com/en-gb/documentation-3/reference/api-reference/) has a corrseponding service in a [PaymillContext](http://paymill.github.io/paymill-js/docs/PaymillContext.html) . For example, to access transaction functions you can use ``paymill.transactions``.

Available methods are (depending on the service):

- **create ( or createXXX )**
A service may include multiple create methods, depending on the parameters. You cannot create an object locally and call create with it, you have to supply the input parameters.
- ** fromXXX(mandatory).withXXX(optional)...withXXX(optional).create()**
Some services have a lot of optional parameters. For those services you can call one of the fromXXX() methods (with the mandatory parameters). These methods return a "creator". You can add optional parameters by chain calling withXXX() on the creator. Don't forget to call create() at the end.
- **update**
Accepts an object. The same object will be updated and returned.
- **remove**
Accepts an object or an objects id and returns an object. If the parameter is an object, the same object will be updated and returned.
- **detail**
Accepts an object or an objects id. If the parameter is an object, acts like a "refresh" and updates it.
- **list**
Accepts count and offset parameters for pagination, as well as order and filter. Returns a List object, which holds the global count in ``count`` and an array of the objects in
``items``


### Removing, updating and retrieving

When you use methods like remove, update or detail with an object as argument, the wrapper will use the response from the API to update the **same** object and will return the same object. If you use the id of an object as a string, the wrapper will create a new object and return it.

Example:

```
var transaction; // some transaction you created
paymill.transactions.detail(transaction).then(function(detail){
	if (detail===transaction) {
		console.log("Wrapper works!");
	}
});
```
### Listing entities

All list interfaces return a [PaymillList](http://paymill.github.io/paymill-js/docs/PaymillList.html). The total count is contained in the ``` count ``` variable, the actual array is in the ``` items ``` variable. You can always (optionally) define count, offset, filter or order to a list request. For example, if you like to show all transactions from a praticular client, paginated and order by the creation date, you would use following code:

``` 
pmc.transactions.list(pageSize,pageNumber*pageSize,
(newpmc.Transaction.Filter()).client("client1234"),
pmc.Transaction.Order().created_at().desc())
```

### Callbacks and promises

All service methods are asynchronous. To receive the result you either have to specify a callback function or you use the returned [Promise](http://promises-aplus.github.io/promises-spec/).
#### Callbacks
The last parameter of every service method is a callback. The callback will be executed after the request. The format of the callbacks is platform specific.

- **Node** 
In Node, the wrapper expects the callback to be a function in the form ``function(error,result)`` .
- **Parse**
In Parse, the wrapper expects the callback to be an object in the form 

```
var callback= {
	success: function(result) {…},
	error: function(error) {..}
}
```
#### Promises
All service methods return an A+ compliant [Promise](http://promises-aplus.github.io/promises-spec/). The promise is resolved with the result or rejected with an error. You can chain promises like this:

```
paymill.clients.create().then(function(client) {
	//client created, lets create a payment
	return paymill.payments.create(atoken,client);
}).then(function(payment){
	//payment created, do something with it
},function(error) {
	// an error occured
});
```

### Deserialization
The Wrapper deserializes all responses from the API. If you need to access the original json, all PAYMILL objects include the ``originalJson`` member, which holds the json used for deserialization.


## Contributors
### Getting started:

- Install node.js
- Run ``npm install`` to install dependencies or ``sudo npm install -g`` to install dependecies globally.
- run ``npm test`` to run jshint and mocha tests. **Note:** you have to have a valid private key in a ``PMAPIKEY`` environment variable.
- run ``npm run-script docs`` to generate documentation

(if Error: Cannot find module X, check if $NODE_PATH is correct)

### Adding a new platform
To add a new platform (XXX), you have to:

- Create a folder ``libXXX``. 
- Implement an ExternalHandler. 
- Make sure [underscore.js](http://underscorejs.org/) is available for your platform.
- In Gruntfile.js add 

```
XXX : {
	src : ['paymill.js', 'lib/*.js','lib/models/*.js','lib/services/*.js','libXXX/*.js'],
	dest : 'paymill.XXX.js',
},
```

## Changelog

### 2.1.0
+ Upgraded objects to latest version
+ TransactionService now supports a Creator.
* Updated project dependencies

### 2.0.0
+ Upgraded to PAYMILL API v2.1
* Changed library interface to support multiple instances (e.g. for marketplaces)
* Added Travis and Codeclimate
* Updated project dependencies

### 1.1.0
+ Added support for preauthorization description [#8](https://github.com/paymill/paymill-js/issues/8)
* updated project dependencies

### 1.0.1
+ Added support for source identifier

### 1.0.0
* Stable release

## License

Copyright 2013 PAYMILL GmbH.

MIT License (enclosed)
