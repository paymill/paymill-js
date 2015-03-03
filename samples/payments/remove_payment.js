pm.payments.remove("pay_3af44644dd6d25c820a8").then(function(payment) {
	console.log("payment deleted:" + payment.id);
}, function(error) {
	console.log("couldnt remove payment:" + error);
});
