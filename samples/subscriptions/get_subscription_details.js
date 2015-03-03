pm.subscriptions.detail("sub_dc180b755d10da324864").then(function(subscription) {
	console.log("subscription:" + subscription.id);
}, function(error) {
	console.log("couldnt get subscription:" + error);
});
