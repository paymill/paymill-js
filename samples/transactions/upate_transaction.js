pm.transactions.detail("tran_023d3b5769321c649435").then(function(transaction) {
	transaction.description = "My updated transaction description";
	return pm.transactions.update(transaction);
}).then(function(updatedTransaction) {
	console.log("updated transaction:" + updatedTransaction.description);
}, function(error) {
	console.log("couldnt update transaction:" + error);
});
