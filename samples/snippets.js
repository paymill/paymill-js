var pmc = require('../paymill.node.js');
var pm = pmc.initialize("<DEIN_PRIVATE_KEY>");

//PAYMENTS

// create credit card with token
pm.payments.create("098f6bcd4621d373cade4e832627b4f6").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt create payment:" + error);
});
// create credit card with token and client
pm.payments.create("098f6bcd4621d373cade4e832627b4f6", "client_88a388d9dd48f86c3136").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt create payment:" + error);
});

// create direct debit with token
pm.payments.create("12a46bcd462sd3r3care4e8336ssb4f5").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt create payment:" + error);
});

// create direct debit with token and client
pm.payments.create("12a46bcd462sd3r3care4e8336ssb4f5", "client_88a388d9dd48f86c3136").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt create payment:" + error);
});

// detail
pm.payments.detail("pay_917018675b21ca03c4fb").then(function(payment) {
	console.log("payment:" + payment.id);
}, function(error) {
	console.log("couldnt get payment:" + error);
});

// list
pm.payments.list().then(function(pmlist) {
	console.log(pmlist.items.length + " payments from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list payments:" + error);
});
//remove
pm.payments.remove("pay_3af44644dd6d25c820a8").then(function(payment) {
	console.log("payment deleted:" + payment.id);
}, function(error) {
	console.log("couldnt remove payment:" + error);
});

//Preauthorizations

// create with token
pm.preauthorizations.createWithToken("098f6bcd4621d373cade4e832627b4f6", 4200, "EUR").then(function(preauth) {
	console.log("preauth:" + preauth.id);
}, function(error) {
	console.log("couldnt create preauth:" + error);
});

// create with payment
pm.preauthorizations.createWithPayment("pay_d43cf0ee969d9847512b", 4200, "EUR").then(function(preauth) {
	console.log("preauth:" + preauth.id);
}, function(error) {
	console.log("couldnt create preauth:" + error);
});

// detail
pm.preauthorizations.detail("preauth_31eb90495837447f76b7").then(function(preauth) {
	console.log("preauth:" + preauth.id);
}, function(error) {
	console.log("couldnt get preauths:" + error);
});

// list
pm.preauthorizations.list().then(function(pmlist) {
	console.log(pmlist.items.length + " preauths from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list preauths:" + error);
});

//Transactions
// create with token
pm.transactions.createWithToken("098f6bcd4621d373cade4e832627b4f6", 4200, "EUR", "Test Transaction").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
// create with payment
pm.transactions.createWithPayment("pay_2f82a672574647cd911d", 4200, "EUR", "Test Transaction").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
//create with payment and client
pm.transactions.createWithPayment("pay_2f82a672574647cd911d", 4200, "EUR", "Test Transaction", "client_c781b1d2f7f0f664b4d9").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});
// create with preauth
pm.transactions.createWithPreauthorization("preauth_ec54f67e52e92051bd65", 4200, "EUR", "Test Transaction").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});

// create with app fee
pm.transactions.createWithToken("098f6bcd4621d373cade4e832627b4f6", 4200, "EUR", "Test Transaction", null, 420, "pay_3af44644dd6d25c820a8").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt create transaction:" + error);
});

// detail
pm.transactions.detail("tran_023d3b5769321c649435").then(function(transaction) {
	console.log("transaction:" + transaction.id);
}, function(error) {
	console.log("couldnt get transaction:" + error);
});

// update
pm.transactions.detail("tran_023d3b5769321c649435").then(function(transaction) {
	transaction.description = "My updated transaction description";
	return pm.transactions.update(transaction);
}).then(function(updatedTransaction) {
	console.log("updated transaction:" + updatedTransaction.description);
}, function(error) {
	console.log("couldnt update transaction:" + error);
});

// list
pm.transactions.list().then(function(pmlist) {
	console.log(pmlist.items.length + " transactions from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list transactions:" + error);
});

//Refunds

// refund transaction
pm.transactions.refund("result", 4200, "Sample Description").then(function(refund) {
	console.log("refund:" + refund.id);
}, function(error) {
	console.log("couldnt refund transaction:" + error);
});

//detail

pm.refunds.detail("refund_773ab6f9cd03428953c9").then(function(refund) {
	console.log("refund:" + refund.id);
}, function(error) {
	console.log("couldnt get refund:" + error);
});

//list
pm.refunds.list().then(function(pmlist) {
	console.log(pmlist.items.length + " refunds from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list transactions:" + error);
});

// Clients

//create

pm.clients.create("max.mustermann@example.com", "Lovely Client").then(function(client) {
	console.log("client:" + client.id);
}, function(error) {
	console.log("couldnt get client:" + error);
});

// detail
pm.clients.detail("client_88a388d9dd48f86c3136").then(function(client) {
	console.log("client:" + client.id);
}, function(error) {
	console.log("couldnt get client:" + error);
});

// update
pm.clients.detail("client_88a388d9dd48f86c3136").then(function(client) {
	client.description = "My Updated Lovely Client";
	return pm.clients.update(client);
}).then(function(updatedClient) {
	console.log("updated client:" + updatedClient.description);
}, function(error) {
	console.log("couldnt update client:" + error);
});

//remove
pm.clients.remove("client_88a388d9dd48f86c3136").then(function(client) {
	console.log("deleted client:" + client.id);
}, function(error) {
	console.log("couldnt get transaction:" + error);
});
// list
pm.clients.list().then(function(pmlist) {
	console.log(pmlist.items.length + " clients from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list clients:" + error);
});

// Offers

//create
pm.offers.create(4200, "EUR", "1 MONTH", "Test Offer").then(function(offer) {
	console.log("offer:" + offer.id);
}, function(error) {
	console.log("couldnt get client:" + error);
});

// detail
pm.offers.detail("offer_40237e20a7d5a231d99b").then(function(offer) {
	console.log("offers:" + offer.id);
}, function(error) {
	console.log("couldnt get offer:" + error);
});

//update

pm.offers.detail("offer_40237e20a7d5a231d99b").then(function(offer) {
	offer.name = "Updated offer";
	return pm.offers.update(offer);
}).then(function(updatedOffer) {
	console.log("updated offer:" + updatedOffer.description);
}, function(error) {
	console.log("couldnt update offer:" + error);
});

//remove
pm.offers.remove("offer_40237e20a7d5a231d99b",false).then(function(offer) {
	console.log("deleted offer:" + offer.id);
}, function(error) {
	console.log("couldnt get offer:" + error);
});

// list
pm.offers.list().then(function(pmlist) {
	console.log(pmlist.items.length + " offers from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list offers:" + error);
});

// Subscriptions

//create without offer
pm.subscriptions.fromParams("pay_5e078197cde8a39e4908f8aa",3000,"EUR","1 week,monday").withClient( "client_81c8ab98a8ac5d69f749" ).withName( "Example Subscription" ).withPeriodOfValidity( "2 YEAR" ).withStartDate( new Date(1400575533)).create().then( function(subscription) {
	console.log("created subscription:" + subscription.id);
}, function(error) {
	console.log("couldnt create subscription:" + error);
});

//create with offer
pm.subscriptions.fromOffer("pay_95ba26ba2c613ebb0ca8","offer_40237e20a7d5a231d99b").withClient( "client_64b025ee5955abd5af66" ).withName( "Example Subscription" ).withPeriodOfValidity( "2 YEAR" ).withStartDate( new Date(1400575533)).create().then( function(subscription) {
    console.log("created subscription:" + subscription.id);
}, function(error) {
    console.log("couldnt create subscription:" + error);
});

//create with offer and different values
pm.subscriptions.fromOffer("pay_5e078197cde8a39e4908f8aa","offer_b33253c73ae0dae84ff4").withClient( "client_81c8ab98a8ac5d69f749" ).withAmount( 3000 ).withCurrency( "EUR").withInterval("1 week,monday").withName( "Example Subscription" ).withPeriodOfValidity( "2 YEAR" ).withStartDate( new Date(1400575533)).create().then( function(subscription) {
    console.log("created subscription:" + subscription.id);
}, function(error) {
    console.log("couldnt create subscription:" + error);
});

// detail
pm.subscriptions.detail("sub_dc180b755d10da324864").then(function(subscription) {
	console.log("subscription:" + subscription.id);
}, function(error) {
	console.log("couldnt create subscription:" + error);
});

//update general

pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    subscription.name = "Changed Subscription";
    return pm.transactions.update(subscription);
}).then(function(updatedSubscription) {
    console.log("updated subscription name:" + updatedSubscription.name);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});

// update amount

pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.changeAmountTemporary(subscription, 1234);
}).then(function(updatedSubscription) {
    console.log("updated subscription amount:" + updatedSubscription.amount);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});

// update offer

pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.changeOfferChangeCaptureDateAndRefund(subscription, "offer_d7e9813a25e89c5b78bd");
}).then(function(updatedSubscription) {
    console.log("updated subscription offer:" + updatedSubscription.offer.id);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});

// update offer

pm.subscriptions.detail("sub_dea86e5c65b2087202e3").then(function(subscription) {
    return pm.transactions.pause(subscription);
}).then(function(updatedSubscription) {
    console.log("updated subscription status:" + updatedSubscription.status);
}, function(error) {
    console.log("couldnt update the subscription:" + error);
});

//cancel
pm.subscriptions.cancel("sub_d68bcdc8656a7932eb44").then(function(subscription) {
    console.log("canceled subscription :" + subscription.status);
}, function(error) {
    console.log("couldnt cancel subscription:" + error);
});

// delete
pm.subscriptions.delete("sub_d68bcdc8656a7932eb44").then(function(subscription) {
    console.log("deleted subscription :" + subscription.status);
}, function(error) {
    console.log("couldnt delete subscription:" + error);
});

// list
pm.subscriptions.list().then(function(pmlist) {
	console.log(pmlist.items.length + " offers from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list offers:" + error);
});


//Webhooks

//create url
pm.webhooks.createUrl("<your-webhook-url>",[pm.Webhook.EventType.TRANSACTION_SUCCEDED]).then(function(webhook) {
	console.log("created webhook:" + webhook.id);
}, function(error) {
	console.log("couldnt get webhook:" + error);
});

//create email
pm.webhooks.createEmail("<your-webhook-email>",[pm.Webhook.EventType.TRANSACTION_SUCCEDED]).then(function(webhook) {
	console.log("created webhook:" + webhook.id);
}, function(error) {
	console.log("couldnt get webhook:" + error);
});

// detail
pm.webhooks.detail("hook_40237e20a7d5a231d99b").then(function(webhook) {
	console.log("webhook:" + webhook.id);
}, function(error) {
	console.log("couldnt get webhook:" + error);
});

//update

pm.webhooks.detail("hook_40237e20a7d5a231d99b").then(function(webhook) {
	webhook.email = "<your-udpated-webhook-email>";
	return pm.webhooks.update(webhook);
}).then(function(updatedWebhook) {
	console.log("updated webhook:" + updatedWebhook.description);
}, function(error) {
	console.log("couldnt update webhook:" + error);
});

//remove
pm.webhooks.remove("hook_40237e20a7d5a231d99b").then(function(webhook) {
	console.log("deleted webhook:" + webhook.id);
}, function(error) {
	console.log("couldnt get webhook:" + error);
});

// list
pm.webhooks.list().then(function(pmlist) {
	console.log(pmlist.items.length + " webhooks from total of " + pmlist.count);
}, function(error) {
	console.log("couldnt list webhooks:" + error);
});