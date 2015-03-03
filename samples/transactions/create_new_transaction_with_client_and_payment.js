pm.transactions.createWithPayment("pay_2f82a672574647cd911d", 4200, "EUR", "Test Transaction", "client_c781b1d2f7f0f664b4d9").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
