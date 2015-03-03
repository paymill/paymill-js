pm.offers.detail("offer_40237e20a7d5a231d99b").then(function(offer) {
    offer.name = "Extended Special";
    return pm.offers.update(offer);
}).then(function(updatedOffer) {
    console.log("updated offer:" + updatedOffer.description);
}, function(error) {
    console.log("couldnt update offer:" + error);
});
