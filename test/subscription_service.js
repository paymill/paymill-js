var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe.only('SubscriptionService', function() {
	this.timeout(5000);
    var today = new Date();
    var inAweek = new Date(today.getTime() + (86400 * 7 * 1000));

	describe('#create() with all ', function() {
        it('should create an subscription with payment and offer', function(done) {
            var payment;
            var client;
            var offer;
            var name = shared.randomDescription();
            return pmc.clients.create().then(function(res) {
                client = res;
                return shared.createPayment(client);
            }).then(function(res) {
                payment = res;
                return shared.createOffer();
            }).then(function(res) {
                offer = res;
                return pmc.subscriptions.createWithAll(payment,client,offer,null,null,null,null,name);
            }).then(function(sub) {
                expect(sub.payment.id).to.be(payment.id);
                expect(sub.client.id).to.be(client.id);
                expect(sub.offer.id).to.be(offer.id);
                expect(sub.name).to.be(name);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
	});
    describe('#create() with creator ', function() {
        it('should create a subscription with params', function(done) {
            var payment;
            var client;
            var amount = shared.randomAmount();
            var name = shared.randomDescription();
            return pmc.clients.create().then(function(res) {
                client = res;
                return shared.createPayment(client);
            }).then(function(res) {
                payment = res;
                return pmc.subscriptions.fromParams(payment,amount,"EUR","2 MONTH,friday").withClient( client )
                    .withName( name )
                    .withPeriodOfValidity( "1 YEAR" ).withStartDate( inAweek ).create();
            }).then(function(sub) {
                expect(sub.payment.id).to.be(payment.id);
                expect(sub.client.id).to.be(client.id);
                expect(sub.currency).to.be("EUR");
                expect(sub.amount).to.be(amount);
                expect(sub.interval.length).to.be(2);
                expect(sub.interval.unit).to.be(pm.Interval.Unit.MONTH);
                expect(sub.interval.chargeday).to.be(pm.Interval.Weekday.FRIDAY);
                expect(sub.name).to.be(name);
                expect(sub.period_of_validity.length).to.be(1);
                expect(sub.period_of_validity.unit).to.be(pm.Interval.Unit.YEAR);
                expect(sub.trial_end.getTime()).to.be.above(inAweek.getTime()-2*60*60*60);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
        it('should create a subscription with payment and offer', function(done) {
            var payment;
            var client;
            var offer;
            var name = shared.randomDescription();
            return pmc.clients.create().then(function(res) {
                client = res;
                return shared.createPayment(client);
            }).then(function(res) {
                payment = res;
                return shared.createOffer();
            }).then(function(res) {
                offer = res;
                return pmc.subscriptions.fromOffer(payment,offer).withClient( client )
                    .withAmount( offer.amount * 5 ).withCurrency( "EUR" ).withInterval( "2 WEEK,monday" ).withName( name )
                    .withPeriodOfValidity( "1 YEAR" ).withStartDate( inAweek ).create();
            }).then(function(sub) {
                expect(sub.payment.id).to.be(payment.id);
                expect(sub.client.id).to.be(client.id);
                expect(sub.offer.id).to.be(offer.id);
                expect(sub.currency).to.be("EUR");
                expect(sub.amount).to.be(offer.amount * 5);
                expect(sub.interval.length).to.be(2);
                expect(sub.interval.unit).to.be(pm.Interval.Unit.WEEK);
                expect(sub.interval.chargeday).to.be(pm.Interval.Weekday.MONDAY);
                expect(sub.name).to.be(name);
                expect(sub.period_of_validity.length).to.be(1);
                expect(sub.period_of_validity.unit).to.be(pm.Interval.Unit.YEAR);
                expect(sub.trial_end.getTime()).to.be.above(inAweek.getTime()-2*60*60*60);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#update()', function() {
        it('normal update of name', function(done) {
            shared.verifyUpdate(shared.createSubscription, pmc.subscriptions, "name", "newdesc" + shared.randomAmount()).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
        it('normal update of interval', function(done) {
            var some;
            var newInterval = new pm.Interval(3, pm.Interval.Unit.MONTH, pm.Interval.Weekday.FRIDAY);
            shared.createSubscription().then(function(result) {
                some = result;
                some.interval = newInterval;
                return pmc.subscriptions.update(some);
            }).then(function(updated) {
                expect(updated.interval.length).to.be(newInterval.length);
                expect(updated.interval.unit).to.be(newInterval.unit);
                expect(updated.interval.chargeday).to.be(newInterval.chargeday);
                expect(updated.interval.toString()).to.be(newInterval.toString());
                return pmc.subscriptions.detail(updated);
            }).then(function(detailed) {
                expect(detailed.interval.length).to.be(newInterval.length);
                expect(detailed.interval.unit).to.be(newInterval.unit);
                expect(detailed.interval.chargeday).to.be(newInterval.chargeday);
                expect(detailed.interval.toString()).to.be(newInterval.toString());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
        it('string update of interval', function(done) {
            var some;
            var newInterval = new pm.Interval(4, pm.Interval.Unit.WEEK, pm.Interval.Weekday.MONDAY);
            shared.createSubscription().then(function(result) {
                some = result;
                some.interval = "4 WEEK, MONDAY";
                return pmc.subscriptions.update(some);
            }).then(function(updated) {
                expect(updated.interval.length).to.be(newInterval.length);
                expect(updated.interval.unit).to.be(newInterval.unit);
                expect(updated.interval.chargeday).to.be(newInterval.chargeday);
                expect(updated.interval.toString()).to.be(newInterval.toString());
                return pmc.subscriptions.detail(updated);
            }).then(function(detailed) {
                expect(detailed.interval.length).to.be(newInterval.length);
                expect(detailed.interval.unit).to.be(newInterval.unit);
                expect(detailed.interval.chargeday).to.be(newInterval.chargeday);
                expect(detailed.interval.toString()).to.be(newInterval.toString());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });
	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pmc.subscriptions.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.subscriptions).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.subscriptions, pm.Subscription.Order.created_at().asc(), pm.Subscription.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createSubscription, pmc.subscriptions, (new pm.Subscription.Filter()), "offer").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});

});
