var pm = require("cloud/paymill.parse.js");
pm.initialize("ENTER_YOUR_PAYMILL_API_KEY_HERE");
Parse.Cloud.define("testPMPromise", function(request, response) {
	var withPromise;
	var withCallback = true;
	var results = [];
	pm.clients.create().then(function(result) {
		results.push("Client promise result is OK:" + JSON.stringify(result));
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	}, function(e) {
		results.push("Promise result is NOT ok:" + e);
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	});
});
Parse.Cloud.define("testPMPromiseChain", function(request, response) {
	var withPromise1;
	var withPromise2 = true;
	var results = [];
	pm.clients.create().then(function(result) {
		console.log("result1");
		results.push("Client1 promise result is OK:" + JSON.stringify(result));
		withPromise1 = true;
		return pm.clients.create();
	}).then(function(result) {
		console.log("result2");
		results.push("Client2 promise result is OK:" + JSON.stringify(result));
		withPromise = true;
		if (withPromise1 && withPromise2) {
			var res = results.join("\n");
			response.success(res);
		}
	}, function(e) {
		results.push("Promise result is NOT ok:" + e);
		var res = results.join("\n");
		response.success(res);
	});
});
Parse.Cloud.define("testPMPromiseAndCallback", function(request, response) {
	var withPromise;
	var withCallback;
	var results = [];
	pm.clients.create(null, null, {
		success : function(result) {
			withCallback = true;
			results.push("Client callback result is OK:" + JSON.stringify(result));
			if (withPromise && withCallback) {
				var res = results.join("\n");
				response.success(res);
			}
		},
		error : function(error) {
			withCallback = true;
			results.push("Client callback result is NOT OK:" + error);
			if (withPromise && withCallback) {
				var res = results.join("\n");
				response.success(res);
			}
		}
	}).then(function(result) {
		results.push("Client promise result is OK:" + result);
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	}, function(e) {
		results.push("Client Promise result is NOT ok:" + e);
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	});
});
Parse.Cloud.define("testPMGetWithParams", function(request, response) {
	var withPromise;
	var withCallback = true;
	var results = [];
	pm.clients.list(10, 10, null, pm.Client.Order.created_at().asc()).then(function(result) {
		results.push("Client promise result is OK:" + JSON.stringify(result));
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	}, function(e) {
		results.push("Promise result is NOT ok:" + e);
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	});
});
Parse.Cloud.define("testPMPostWithParams", function(request, response) {
	var withPromise;
	var withCallback = true;
	var results = [];
	pm.clients.create("test@mail.com", "lovely client").then(function(result) {
		results.push("Client promise result is OK:" + JSON.stringify(result));
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	}, function(e) {
		results.push("Promise result is NOT ok:" + e);
		withPromise = true;
		if (withPromise && withCallback) {
			var res = results.join("\n");
			response.success(res);
		}
	});
});

Parse.Cloud.define("testCreatePayment", function(request, response) {
	pm.payments.create("098f6bcd4621d373cade4e832627b4f6").then(function(payment) {
		response.success("Payment created successfully");
	}, function(error) {
		response.error("Problem creating payment: " + error.message);
	});
}); 