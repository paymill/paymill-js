var pm = require('../paymill.node.js');
var when = require("when");
var expect = require("expect.js");
var https = require('https');
var when = require("when");

var pmc = null;

var defaultCurrency = "EUR";
var defaultToken = "098f6bcd4621d373cade4e832627b4f6";
var webhookEvent = pm.Webhook.EventType.TRANSACTION_SUCCEDED;
var webhookEventArray = [pm.Webhook.EventType.TRANSACTION_SUCCEDED,pm.Webhook.EventType.TRANSACTION_FAILED];
var publicKey = process.env.PMPUBLICAPIKEY;

if (!process.env.PMAPIKEY) {
	throw new Error("you have to have a valid private kay in a PMAPIKEY environment variable.");
} else {
    pmc = pm.getContext(process.env.PMAPIKEY);
		// try to get a new token
		//try {
			https.get(getTokenUrl(), function(res) {
				res.on("data", function(chunk) {
    			try {
						chunks = chunk.toString();
						obj = JSON.parse(chunks.substring(15,chunks.length - 1));
						defaultToken = obj.transaction.identification.uniqueId;
						console.log("Extracted token:" + defaultToken);
					} catch (e) {
						console.log("Cannot extract token from:" + chunk + ". Exception:" + e);
					}
  			});
			}).on('error', function(e) {
  			console.log("Cannot request token: " + e.message);
			});
		//} catch(e) {
		//	console.error("Could not fetch new token (" + e + ")")
		//}
}

exports.pm = pm;
exports.pmc = pmc;

exports.webhookEvent = webhookEvent;
exports.webhookEventArray = webhookEventArray;
exports.expect = expect;
exports.apiKey = process.env.PMAPIKEY;
exports.token = defaultToken;


exports.getToken = getToken;
function getToken() {
	var defer = when.defer();
	https.get(getTokenUrl(), function(res) {
		res.on("data", function(chunk) {
			try {
				chunks = chunk.toString();
				obj = JSON.parse(chunks.substring(15,chunks.length - 1));
				var result = obj.transaction.identification.uniqueId;
				defer.resolve(result);
			} catch (e) {
				defer.reject("Cannot extract token from:" + chunk + ". Exception:" + e);
			}
		});
	}).on('error', function(e) {
		defer.reject("Cannot request token: " + e.message);
	});
	return defer.promise;
}

exports.currency = defaultCurrency;
exports.toStrinAmount = function(amount) {
	var res = "" + amount;
	while (res.length < 3) {
		res = "0" + res;
	}
	return res;
};
randomAmount = function(from, to) {
	if (!from) {
		return randomAmount(100, to);
	}
	if (!to) {
		return randomAmount(from, 10000);
	}
	return from + Math.floor(Math.random() * (to - from));
};
exports.randomAmount = randomAmount;
exports.randomDescription = function() {
	return "asb" + (1000 + Math.floor(Math.random() * 10000));
};
exports.createClient = createClient;
function createClient() {
	var description = "desc" + randomAmount();
	var email = "user" + randomAmount() + "@test.com";
	return pmc.clients.create(email, description);
}

exports.createTransaction = createTransaction;
function createTransaction() {
	return pmc.transactions.createWithToken(defaultToken, randomAmount(), defaultCurrency, "test1234");
}

exports.createRefund = createRefund;
function createRefund() {
	var transaction;
	return createTransaction().then(function(result) {
		transaction = result;
		expect(result).to.be.a(pm.Transaction);
		return pmc.transactions.refund(result, 150, "testrefund");
	}).then(function(refund) {
		expect(refund).to.be.a(pm.Refund);
		expect(refund.amount.toString()).to.be("150");
		expect(refund.description).to.be("testrefund");
		expect(refund.transaction.id).to.be(transaction.id);
		return when.resolve(refund);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
}

exports.createPayment = createPayment;
function createPayment(client) {
	if (client) {
		var id;
		if (client.id) {
			id = client.id;
		} else {
			id = client;
		}
		return pmc.payments.create(defaultToken, client).then(function(payment) {
			expect(payment).to.be.a(pm.Payment);
			expect(payment.client.id).to.be(id);
			checkPaymentFields(payment);
			return when.resolve(payment);
		}).then(function(result) {
			return when.resolve(result);
		}, function(err) {
			return when.reject(err);
		});
	} else {
		return pmc.payments.create(defaultToken).then(function(payment) {
			expect(payment).to.be.a(pm.Payment);
			checkPaymentFields(payment);
			return when.resolve(payment);
		}).then(function(result) {
			return when.resolve(result);
		}, function(err) {
			return when.reject(err);
		});
	}
}

exports.createOffer = createOffer;
function createOffer(trialStart, interval) {
	var amount = randomAmount();
	var currency = defaultCurrency;
	var name = "offer" + randomAmount();
    if (!interval) {
	    interval = new pm.Interval(2, pm.Interval.Unit.WEEK);
    }
	return pmc.offers.create(amount, currency, interval, name, trialStart).then(function(offer) {
		expect(offer).to.be.a(pm.Offer);
		checkOfferFields(offer);
		expect(offer.amount).to.be("" + amount);
		expect(offer.name).to.be(name);
		expect(offer.currency).to.be(currency);
		expect(offer.interval.toString()).to.be(interval.toString());
		expect(offer.interval.length).to.be(interval.length);
		expect(offer.interval.unit).to.be(interval.unit);
		return when.resolve(offer);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
}

exports.createEmailWebhook = createEmailWebhook;
function createEmailWebhook() {
	var email = "testuser" + randomAmount() + "@test.com";
	return pmc.webhooks.createEmail(email, webhookEventArray).then(function(webhook) {
		expect(webhook.email).to.be(email);
		expect(webhook.event_types[0]).to.be(webhookEventArray[0]);
		return when.resolve(webhook);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
}

exports.createUrlWebhook = createUrlWebhook;
function createUrlWebhook() {
	var url = "http://test" + randomAmount() + ".test.com";
	return pmc.webhooks.createUrl(url, webhookEventArray).then(function(webhook) {
		expect(webhook.url).to.be(url);
        expect(webhook.event_types[0]).to.be(webhookEventArray[0]);
        expect(webhook.event_types[1]).to.be(webhookEventArray[1]);
		return when.resolve(webhook);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
}

exports.createSubscription = createSubscription;
function createSubscription() {
	var payment;
	var client;
	var offer;
	return pmc.clients.create().then(function(res) {
		client = res;
		return createPayment(client);
	}).then(function(res) {
		payment = res;
		return createOffer();
	}).then(function(res) {
		offer = res;
		return pmc.subscriptions.createWithAll(payment, client, offer );
	}).then(function(sub) {
		checkSubscriptionFields(sub);
		expect(sub.payment.id).to.be(payment.id);
		expect(sub.client.id).to.be(client.id);
		expect(sub.offer.id).to.be(offer.id);
		return when.resolve(sub);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
}

exports.verifyListOrderChanged = verifyListOrderChanged;
function verifyListOrderChanged(service, orderOne, orderTwo) {
	var firstId;
	return service.list(null, null, null, orderOne).then(function(firstList) {
		expect(firstList).to.be.a(pm.PaymillList);
		firstId = firstList.items[0].id;
		return service.list(null, null, null, orderTwo);
	}).then(function(secondlist) {
		var secId = secondlist.items[0].id;
		expect(secId).to.be.ok();
		expect(secondlist.items[0].id).to.not.be(firstId);
		return when.resolve(secondlist);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
	;
}

exports.verifyListFilter = verifyListFilter;
function verifyListFilter(factory, service, filter, property) {
	var original;
	return (factory()).then(function(result) {
		original = result[property];
		filter[property](original);
		return service.list(null, null, filter);
	}).then(function(list) {
		expect(list).to.be.a(pm.PaymillList);
		expect(list.items.length).to.be.above(0);
		//if it is a pm object
		if (original.id) {
			expect(list.items[0][property].id).to.be(original.id);
		} else {
			expect(list.items[0][property]).to.be(original);
		}
		return when.resolve(list);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
};
exports.verifyListCountOffset = verifyListCountOffset;
function verifyListCountOffset(service) {
	var count;
	var offset;
	return service.list().then(function(allList) {
		expect(allList).to.be.a(pm.PaymillList);
		var all = allList.count;
		count = Math.min(all, 5);
		offset = Math.min(all - count, 5);
		return service.list(count, offset);
	}).then(function(list) {
		expect(list).to.be.a(pm.PaymillList);
		expect(list.items.length).to.be(count);
		return when.resolve(list);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
};

exports.verifyRemoveWithDetail = verifyRemoveWithDetail;
function verifyRemoveWithDetail(factory, service, type) {
	var some;
	return (factory()).then(function(result) {
		some = result;
		return service.remove(some);
	}).then(function(removed) {
		expect(removed).to.be.a(type);
		return service.detail(removed);
	}).then(function(result) {
		return when.reject(new Error("detail should fail after remove"));
	}, function(err) {
		return when.resolve(some);
	});
};

exports.verifyUpdate = verifyUpdate;
function verifyUpdate(factory, service, property, newvalue) {
	var some;
	return (factory()).then(function(result) {

		some = result;
		some[property] = newvalue;
		return service.update(some);
	}).then(function(updated) {
		if (updated[property].id) {
			expect(updated[property].id).to.be(newvalue.id);
		} else {
			expect(updated[property]).to.be(newvalue);
		}
		return service.detail(updated);
	}).then(function(detailed) {

		if (detailed[property].id) {
			expect(detailed[property].id).to.be(newvalue.id);
		} else {
			expect(detailed[property]).to.be(newvalue);
		}
		return when.resolve(detailed);
	}).then(function(result) {
		return when.resolve(result);
	}, function(err) {
		return when.reject(err);
	});
};


exports.datesAroundTheSame = datesAroundTheSame;
function datesAroundTheSame(firstDate,secondDate,minutes) {
    if (!minutes) {
        minutes = 60;
    }
    var timespan = minutes * 60 * 1000;
    return Math.abs( firstDate.getTime() - secondDate.getTime() ) < timespan;

};
function checkOfferFields(target) {
	expect(target.id).to.be.ok();
	expect(target.amount).to.be.ok();
	expect(target.name).to.be.ok();
	expect(target.currency).to.be.ok();
	expect(target.subscription_count).to.be.ok();
	expect(target.created_at).to.be.ok();
	expect(target.updated_at).to.be.ok();
}

function checkPaymentFields(target) {
	expect(target.id).to.be.ok();
	expect(target.card_type).to.be.ok();
	expect(target.last4).to.be.ok();
	expect(target.expire_month).to.be.ok();
	expect(target.expire_year).to.be.ok();
	expect(target.created_at).to.be.ok();
	expect(target.updated_at).to.be.ok();
}

function checkSubscriptionFields(target) {
	expect(target.id).to.be.ok();
	expect(target.offer).to.be.ok();
	expect(target.payment).to.be.ok();
	expect(target.client).to.be.ok();
	expect(target.created_at).to.be.ok();
	expect(target.updated_at).to.be.ok();
}

function getTokenUrl() {
	return "https://test-token.paymill.com/?transaction.mode=CONNECTOR_TEST&channel.id=" + publicKey + "&jsonPFunction=paymilljstests&account.number=4111111111111111&account.expiry.month=12&account.expiry.year=2015&account.verification=123&account.holder=Max%20Mustermann&presentation.amount3D=&presentation.currency3D=";
}
