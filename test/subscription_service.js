var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('SubscriptionService', function() {
    this.timeout(15000);
    var today = new Date();
    var inAweek = new Date(today.getTime() + (86400 * 7 * 1000));
    var inTwoWeeks = new Date(today.getTime() + 2*(86400 * 7 * 1000));

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

        it('normal update of payment', function(done) {
          var subscription;
          var newpayment ;
          shared.createSubscription().then(function(result) {
              subscription = result;
              return shared.createPayment(subscription.client.id);
          }).then(function(payment) {
              newpayment = payment;
              subscription.payment = newpayment.id;
              return pmc.subscriptions.update(subscription);
          }).then(function(updated) {
              expect(updated.payment.id).to.be(newpayment.id);
          }).then(function() {
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
    describe('#pause() and #unpause()', function() {
        it('should pause and unpause', function(done) {
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                return pmc.subscriptions.pause(sub);
            }).then(function(paused) {
                expect(paused.status).to.be(pm.Subscription.Status.INACTIVE);
                return pmc.subscriptions.detail(subId);
            }).then(function(pausedRefresh) {
                expect(pausedRefresh.status).to.be(pm.Subscription.Status.INACTIVE);
                return pmc.subscriptions.unpause(pausedRefresh);
            }).then(function(unpaused) {
                expect(unpaused.status).to.be(pm.Subscription.Status.INACTIVE);
                return pmc.subscriptions.detail(subId);
            }).then(function(unpausedRefresh) {
                expect(unpausedRefresh.status).to.be(pm.Subscription.Status.INACTIVE);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });
    describe('#changeAmount()', function() {
        it('should change the amount', function(done) {
            var newAmount = shared.randomAmount();
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                return pmc.subscriptions.changeAmount(sub, newAmount);
            }).then(function(changed) {
                expect(changed.amount.toString()).to.be(newAmount.toString());
                expect(changed.temp_amount).to.be(null);
                return pmc.subscriptions.detail(subId);
            }).then(function(changedRefresh) {
                expect(changedRefresh.amount.toString()).to.be(newAmount.toString());
                expect(changedRefresh.temp_amount).to.be(null);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });
    describe('#changeAmountTemporary()', function() {
        it('should change the amount temporary', function(done) {
            var newAmount = shared.randomAmount();
            var originalAmount = null;
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                originalAmount = sub.amount;
                return pmc.subscriptions.changeAmountTemporary(sub, newAmount);
            }).then(function(changed) {
                expect(changed.amount.toString()).to.be(originalAmount.toString());
                expect(changed.temp_amount.toString()).to.be(newAmount.toString());
                return pmc.subscriptions.detail(subId);
            }).then(function(changedRefresh) {
                expect(changedRefresh.amount.toString()).to.be(originalAmount.toString());
                expect(changedRefresh.temp_amount.toString()).to.be(newAmount.toString());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#changeOfferKeepCaptureDateAndRefund()', function() {
        it('should change the offer and not the next_capture_at', function(done) {
            var newOffer = null;
            var originalOffer = null;
            var originalNextCapture = null;
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                originalOffer = sub.offer.id;
                originalNextCapture = sub.next_capture_at;
                return shared.createOffer();
            }).then(function(offer) {
                newOffer = offer;
                return pmc.subscriptions.changeOfferKeepCaptureDateAndRefund(subId, newOffer);
            }).then(function(updatedSub) {
                expect(updatedSub.offer.id).to.be(newOffer.id);
                expect(updatedSub.next_capture_at.getTime()).to.be(originalNextCapture.getTime());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#changeOfferKeepCaptureDateNoRefund()', function() {
        it('should change the offer and not the next_capture_at', function(done) {
            var newOffer = null;
            var originalOffer = null;
            var originalNextCapture = null;
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                originalOffer = sub.offer.id;
                originalNextCapture = sub.next_capture_at;
                return shared.createOffer();
            }).then(function(offer) {
                newOffer = offer;
                return pmc.subscriptions.changeOfferKeepCaptureDateNoRefund(subId, newOffer);
            }).then(function(updatedSub) {
                expect(updatedSub.offer.id).to.be(newOffer.id);
                expect(updatedSub.next_capture_at.getTime()).to.be(originalNextCapture.getTime());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#changeOfferChangeCaptureDateAndRefund()', function() {
        it('should change the offer and the next_capture_at', function(done) {
            var newOffer = null;
            var originalOffer = null;
            var originalNextCapture = null;
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                originalOffer = sub.offer.id;
                originalNextCapture = sub.next_capture_at;
                return shared.createOffer();
            }).then(function(offer) {
                newOffer = offer;
                return pmc.subscriptions.changeOfferChangeCaptureDateAndRefund(subId, newOffer);
            }).then(function(updatedSub) {
                expect(updatedSub.offer.id).to.be(newOffer.id);
                expect(updatedSub.next_capture_at.getTime()).not.to.be(originalNextCapture.getTime());
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#endTrial()', function() {
        it('should end the trial immediately', function(done) {
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                return pmc.subscriptions.endTrial(subId);
            }).then(function(updatedSub) {
                expect(updatedSub.trial_end).to.be(null);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#endTrialAt()', function() {
        it('should end the trial at the specified date', function(done) {
            var payment;
            var client;
            var amount = shared.randomAmount();
            var name = shared.randomDescription();
            return pmc.clients.create().then(function(res) {
                client = res;
                return shared.createPayment(client);
            }).then(function(res) {
                payment = res;
                return pmc.subscriptions.fromParams(payment, amount, "EUR", "2 MONTH,friday").withStartDate( inAweek ).create();
            }).then(function(sub) {
                expect(shared.datesAroundTheSame(sub.trial_end,inAweek)).to.be(true);
                return pmc.subscriptions.endTrialAt(sub, inTwoWeeks );
            }).then(function(updatedSub) {
                expect(shared.datesAroundTheSame(updatedSub.trial_end,inTwoWeeks)).to.be(true);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#limitValidity() and #unlimitValidity()', function() {
        it('should change the validity', function(done) {
            var payment;
            var client;
            var amount = shared.randomAmount();
            var name = shared.randomDescription();
            return pmc.clients.create().then(function(res) {
                client = res;
                return shared.createPayment(client);
            }).then(function(res) {
                payment = res;
                return pmc.subscriptions.fromParams(payment, amount, "EUR", "2 MONTH,friday").withPeriodOfValidity( "1 YEAR" ).create();
            }).then(function(sub) {
                expect(sub.period_of_validity.toString()).to.be("1 YEAR");
                return pmc.subscriptions.limitValidity(sub, "2 MONTH" );
            }).then(function(sub) {
                expect(sub.period_of_validity.toString()).to.be("2 MONTH");
                return pmc.subscriptions.unlimitValidity(sub);
            }).then(function(sub) {
                expect(sub.period_of_validity).to.be(null);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#delete()', function() {
        it('should delete the subscription', function(done) {
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                return pmc.subscriptions.delete(subId);
            }).then(function(updatedSub) {
                expect(updatedSub.is_deleted).to.be(true);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
        });
    });

    describe('#cancel()', function() {
        it('should cancel the subscription', function(done) {
            var subId = null;
            shared.createSubscription().then(function(sub) {
                subId = sub.id;
                return pmc.subscriptions.cancel(subId);
            }).then(function(updatedSub) {
                expect(updatedSub.is_canceled).to.be(true);
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
