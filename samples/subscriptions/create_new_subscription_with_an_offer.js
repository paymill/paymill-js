pm.subscriptions.fromOffer("pay_95ba26ba2c613ebb0ca8","offer_40237e20a7d5a231d99b")
.withClient( "client_64b025ee5955abd5af66" )
.withName( "Example Subscription" )
.withPeriodOfValidity( "2 YEAR" )
.withStartDate( new Date(1400575533)).create().then( function(subscription) {
    console.log("created subscription:" + subscription.id);
}, function(error) {
    console.log("couldnt create subscription:" + error);
});
