pm.preauthorizations.list().then(function(pmlist) {
	console.log(pmlist.items.length + " preauths from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list preauths:" + error);
});
