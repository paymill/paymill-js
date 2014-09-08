var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('PaymentService', function() {

	describe('#create()', function() {
		it('should create a payment with client', function(done) {
			var client;
			pmc.clients.create().then(function(result) {
				client = result;
				return shared.createPayment(client);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
		it('should create a payment without client', function(done) {
			shared.createPayment().then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});
	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pmc.payments.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.payments).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.payments, pm.Payment.Order.created_at().asc(), pm.Payment.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createPayment, pmc.payments, (new pm.Payment.Filter()), "card_type").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	describe('#remove()', function() {
		it('with id', function(done) {
			shared.verifyRemoveWithDetail(shared.createPayment, pmc.payments, pm.Payment).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});
});