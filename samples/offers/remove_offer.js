pm.offers.remove("offer_40237e20a7d5a231d99b",false).then(function(offer) {
    console.log("deleted offer:" + offer.id);
}, function(error) {
    console.log("couldnt get offer:" + error);
});
