pm.subscriptions.fromOffer("pay_5e078197cde8a39e4908f8aa","offer_b33253c73ae0dae84ff4")
.withClient( "client_81c8ab98a8ac5d69f749" )
.withAmount( 3000 )
.withCurrency( "EUR")
.withInterval("1 week,monday")
.withName( "Example Subscription" )
.withPeriodOfValidity( "2 YEAR" )
.withStartDate( new Date(1400575533))
.create().then( function(subscription) {
    console.log("created subscription:" + subscription.id);
}, function(error) {
    console.log("couldnt create subscription:" + error);
});
