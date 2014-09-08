var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('OfferService', function() {

	describe('#create()', function() {
		it('should create an offer', function(done) {
			shared.createOffer().then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('should create an offer with trial', function(done) {
			shared.createOffer(4).then(function(offer) {
				expect(offer.trial_period_days).to.be(4);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pmc.offers.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.offers).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.offers, pm.Offer.Order.created_at().asc(), pm.Offer.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createOffer, pmc.offers, (new pm.Offer.Filter()), "name").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	describe('#remove()', function() {
		it('with id', function(done) {
			shared.verifyRemoveWithDetail(shared.createOffer, pmc.offers, pm.Offer).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#update()', function() {
		it('update and detail', function(done) {
			shared.verifyUpdate(shared.createOffer, pmc.offers, "name", "newName" + shared.randomAmount()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

});
