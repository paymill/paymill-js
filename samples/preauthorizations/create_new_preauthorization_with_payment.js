pm.preauthorizations.createWithPayment(
    "pay_d43cf0ee969d9847512b",
    4200,
    "EUR",
    "description example"
).then(function(preauth) {
    console.log("preauth:" + preauth.id);
}, function(error) {
    console.log("couldnt create preauth:" + error);
});
