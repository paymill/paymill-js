pm.preauthorizations.detail("preauth_31eb90495837447f76b7").then(function(preauth) {
	console.log("preauth:" + preauth.id);
}, function(error) {
	console.log("couldnt get preauths:" + error);
});
