var shared = require("../test/shared.js");
var pm = shared.pm;
var expect = require("expect.js");
/*
describe('SubscriptionService', function() {
	this.timeout(5000);
	describe('#create()', function() {
		it('should create an subscription', function(done) {
			shared.createSubscription().then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pm.subscriptions.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pm.subscriptions).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pm.subscriptions, pm.Subscription.Order.created_at().asc(), pm.Subscription.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createSubscription, pm.subscriptions, (new pm.Subscription.Filter()), "offer").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	describe('#remove()', function() {
		it('with id', function(done) {
			shared.verifyRemoveWithDetail(shared.createSubscription, pm.subscriptions, pm.Offer).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#update()', function() {
		it('update and detail', function(done) {
			shared.createOffer().then(function(offer) {
				return shared.verifyUpdate(shared.createSubscription, pm.subscriptions, "offer", offer);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

});
*/
