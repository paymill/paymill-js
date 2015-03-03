pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    subscription.name = "Changed Subscription";
    return pm.transactions.update(subscription);
}).then(function(updatedSubscription) {
    console.log("updated subscription name:" + updatedSubscription.name);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});
