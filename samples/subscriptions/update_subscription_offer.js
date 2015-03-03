pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.changeOfferChangeCaptureDateAndRefund(subscription, "offer_d7e9813a25e89c5b78bd");
}).then(function(updatedSubscription) {
    console.log("updated subscription offer:" + updatedSubscription.offer.id);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});
