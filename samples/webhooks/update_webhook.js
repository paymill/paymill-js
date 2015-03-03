pm.webhooks.detail("hook_40237e20a7d5a231d99b").then(function(webhook) {
	webhook.email = "<your-udpated-webhook-email>";
	return pm.webhooks.update(webhook);
}).then(function(updatedWebhook) {
	console.log("updated webhook:" + updatedWebhook.description);
}, function(error) {
	console.log("couldnt update webhook:" + error);
});
