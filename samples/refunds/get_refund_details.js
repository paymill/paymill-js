pm.refunds.detail("refund_87bc404a95d5ce616049").then(function(refund) {
	console.log("refund:" + refund.id);
}, function(error) {
	console.log("couldnt get refund:" + error);
});
