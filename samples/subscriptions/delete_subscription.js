pm.subscriptions.delete("sub_d68bcdc8656a7932eb44").then(function(subscription) {
    console.log("deleted subscription :" + subscription.status);
}, function(error) {
    console.log("couldnt delete subscription:" + error);
});
