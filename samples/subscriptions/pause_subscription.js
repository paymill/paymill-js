pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.pause(subscription);
}).then(function(updatedSubscription) {
    console.log("updated subscription status:" + updatedSubscription.status);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});
