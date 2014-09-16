var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('PreauthorizationService', function() {
	describe('#createWithToken()', function() {
		it('should create a preauth with random amount', function(done) {
			var amount = shared.randomAmount();
			pmc.preauthorizations.createWithToken(shared.token, amount, shared.currency).then(function(result) {
				expect(result).to.be.a(pm.Preauthorization);
				expect(result.amount).to.be(amount.toString());
				expect(result.currency).to.be(shared.currency);
				expect(result.client).to.be.a(pm.Client);
				expect(result.payment).to.be.a(pm.Payment);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});

    describe('#createWithTokenAndDescription()', function() {
        it('should create a preauth with random amount and description', function(done) {
            var amount = shared.randomAmount();
            pmc.preauthorizations.createWithToken(shared.token, amount, shared.currency,"test1234").then(function(result) {
                expect(result).to.be.a(pm.Preauthorization);
                expect(result.amount).to.be(amount.toString());
                expect(result.currency).to.be(shared.currency);
                expect(result.description).to.be("test1234");
                expect(result.client).to.be.a(pm.Client);
                expect(result.payment).to.be.a(pm.Payment);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
            ;
        });
    });

	describe('#createWithPayment()', function() {
		it('should create a preauth with random amount and payment', function(done) {
			var amount = shared.randomAmount();
			var payment;
			pmc.payments.create(shared.token).then(function(payresult) {
				payment = payresult;
				return pmc.preauthorizations.createWithPayment(payment, amount, shared.currency, "test1234");
			}).then(function(result) {
				expect(result).to.be.a(pm.Preauthorization);
                expect(result.amount).to.be(amount.toString());
				expect(result.currency).to.be(shared.currency);
                expect(result.payment.id).to.be(payment.id);
				expect(result.client).to.be.a(pm.Client);
				expect(result.payment).to.be.a(pm.Payment);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});
describe('#list()', function() {
		it('list should work with no params', function(done) {
			pmc.preauthorizations.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.preauthorizations).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.preauthorizations, pm.Preauthorization.Order.created_at().asc(), pm.Preauthorization.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(createPreauth, pmc.preauthorizations, (new pm.Preauthorization.Filter()), "amount").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	describe('#detail()', function() {
		it('detail with id', function(done) {
			var preauth;
			createPreauth().then(function(result) {
				preauth = result;
				return pmc.preauthorizations.detail(preauth);
			}).then(function(result) {
				expect(result).to.be.a(pm.Preauthorization);
				expect(result).to.be(preauth);
				checkPreauthFields(result);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});

});
function createPreauth() {
	return pmc.preauthorizations.createWithToken(shared.token, shared.randomAmount(), shared.currency);
}

function checkPreauthFields(trans) {
	expect(trans.id).to.be.ok();
	expect(trans.amount).to.be.ok();
	expect(trans.currency).to.be.ok();
	expect(trans.status).to.be.ok();
	expect(trans.livemode).to.not.be(null);
	expect(trans.payment).to.be.ok();
	expect(trans.client).to.be.ok();
	expect(trans.created_at).to.be.ok();
	expect(trans.updated_at).to.be.ok();
}