pm.refunds.list().then(function(pmlist) {
	console.log(pmlist.items.length + " refunds from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list transactions:" + error);
});
