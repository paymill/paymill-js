pm.offers.create(4200, "EUR", new pm.OfferInterval(1, pm.OfferInterval.Period.WEEK), "Nerd Special").then(function(offer) {
    console.log("offer:" + offer.id);
}, function(error) {
    console.log("couldnt get client:" + error);
});
