pm.subscriptions.list().then(function(pmlist) {
	console.log(pmlist.items.length + " offers from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list subscriptions:" + error);
});
