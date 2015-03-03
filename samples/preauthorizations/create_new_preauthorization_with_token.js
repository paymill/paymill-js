pm.preauthorizations.createWithToken(
    "098f6bcd4621d373cade4e832627b4f6",
    4200,
    "EUR",
    "description example"
).then(function(preauth) {
    console.log("preauth:" + preauth.id);
}, function(error) {
    console.log("couldnt create preauth:" + error);
});
