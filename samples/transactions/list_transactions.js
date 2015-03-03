pm.transactions.list().then(function(pmlist) {
	console.log(pmlist.items.length + " transactions from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list transactions:" + error);
});
