pm.transactions.createWithPreauthorization("preauth_ec54f67e52e92051bd65", 4200, "EUR", "Test Transaction").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
