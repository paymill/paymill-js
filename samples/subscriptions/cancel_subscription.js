pm.subscriptions.cancel("sub_d68bcdc8656a7932eb44").then(function(subscription) {
    console.log("canceled subscription :" + subscription.status);
}, function(error) {
    console.log("couldnt cancel subscription:" + error);
});
