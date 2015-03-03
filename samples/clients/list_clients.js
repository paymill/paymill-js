pm.clients.list().then(function(pmlist) {
	console.log(pmlist.items.length + " clients from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list clients:" + error);
});
