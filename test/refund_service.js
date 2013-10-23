var shared = require("../test/shared.js");
var pm = shared.pm;
var expect = require("expect.js");

describe('RefundService', function() {

	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pm.offers.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pm.refunds).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pm.refunds, pm.Refund.Order.created_at().asc(), pm.Refund.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createRefund, pm.refunds, (new pm.Refund.Filter()), "transaction").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});

});
