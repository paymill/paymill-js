pm.payments.list().then(function(pmlist) {
	console.log(pmlist.items.length + " payments from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list payments:" + error);
});
