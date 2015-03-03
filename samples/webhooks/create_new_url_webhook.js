pm.webhooks.createUrl("<your-webhook-url>",[
    pm.Webhook.EventType.TRANSACTION_SUCCEDED,
    pm.Webhook.EventType.TRANSACTION_FAILED
]).then(function(webhook) {
    console.log("created webhook:" + webhook.id);
}, function(error) {
    console.log("couldnt get webhook:" + error);
});
