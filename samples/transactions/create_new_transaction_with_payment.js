pm.transactions.createWithPayment("pay_2f82a672574647cd911d", 4200, "EUR", "Test Transaction").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
