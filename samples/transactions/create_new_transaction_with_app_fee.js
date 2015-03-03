pm.transactions.createWithToken("098f6bcd4621d373cade4e832627b4f6", 4200, "EUR", "Test Transaction", null, 420, "pay_3af44644dd6d25c820a8").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
