pm.offers.detail("offer_40237e20a7d5a231d99b").then(function(offer) {
	console.log("offers:" + offer.id);
}, function(error) {
	console.log("couldnt get offer:" + error);
});
