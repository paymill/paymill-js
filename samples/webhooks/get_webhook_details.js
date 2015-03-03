pm.webhooks.detail("hook_40237e20a7d5a231d99b").then(function(webhook) {
	console.log("webhook:" + webhook.id);
}, function(error) {
	console.log("couldnt get webhook:" + error);
});
