pm.payments.create("098f6bcd4621d373cade4e832627b4f6").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt create payment:" + error);
});
