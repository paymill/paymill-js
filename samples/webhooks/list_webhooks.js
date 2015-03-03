pm.webhooks.list().then(function(pmlist) {
	console.log(pmlist.items.length + " webhooks from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list webhooks:" + error);
});
