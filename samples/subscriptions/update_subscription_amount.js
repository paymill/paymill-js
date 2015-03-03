pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.changeAmountTemporary(subscription, 1234);
}).then(function(updatedSubscription) {
    console.log("updated subscription amount:" + updatedSubscription.amount);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});
