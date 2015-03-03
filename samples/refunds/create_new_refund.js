pm.transactions.refund("result", 4200, "Sample Description").then(function(refund) {
	console.log("refund:" + refund.id);
}, function(error) {
	console.log("couldnt refund transaction:" + error);
});
