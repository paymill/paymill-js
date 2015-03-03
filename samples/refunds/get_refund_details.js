pm.refunds.detail("refund_773ab6f9cd03428953c9").then(function(refund) {
	console.log("refund:" + refund.id);
}, function(error) {
	console.log("couldnt get refund:" + error);
});
