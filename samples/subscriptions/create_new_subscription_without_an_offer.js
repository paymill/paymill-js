pm.subscriptions.fromParams("pay_5e078197cde8a39e4908f8aa",3000,"EUR","1 week,monday")
.withClient( "client_81c8ab98a8ac5d69f749" )
.withName( "Example Subscription" )
.withPeriodOfValidity( "2 YEAR" )
.withStartDate( new Date(1400575533))
.create().then( function(subscription) {
    console.log("created subscription:" + subscription.id);
}, function(error) {
    console.log("couldnt create subscription:" + error);
});
