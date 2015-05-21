var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('TransactionService', function() {
	
	describe('#createWithToken()', function() {
		it('should create a transaction with random amount', function(done) {
			var amount = shared.randomAmount();
			pmc.transactions.createWithToken(shared.token, amount, shared.currency, "test1234").then(function(result) {
				expect(result).to.be.a(pm.Transaction);
				expect(result.origin_amount).to.be(amount);
				expect(result.description).to.be("test1234");
				expect(result.currency).to.be(shared.currency);
				expect(result.client).to.be.a(pm.Client);
				expect(result.payment).to.be.a(pm.Payment);
				expect(result.preauthorization).to.be(null);
                expect(result.getResponseCodeDetail()).to.be.a.String;
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});
	describe('#createWithPayment()', function() {
		it('should create a transaction with random amount and payment', function(done) {
			var amount = shared.randomAmount();
			var payment;
			pmc.payments.create(shared.token).then(function(payresult) {
				payment = payresult;
				return pmc.transactions.createWithPayment(payresult, amount, shared.currency, "test1234");
			}).then(function(result) {
				expect(result).to.be.a(pm.Transaction);
				someTransaction = result;
				expect(result.origin_amount).to.be(amount);
				expect(result.description).to.be("test1234");
				expect(result.currency).to.be(shared.currency);
				expect(result.client).to.be.a(pm.Client);
				expect(result.payment).to.be.a(pm.Payment);
				expect(result.payment.id).to.be(payment.id);
				expect(result.preauthorization).to.be(null);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
	});

	describe('#createWithPreauthorization()', function() {
		it('should create a transaction with random amount and preauthorization', function(done) {
			var amount = shared.randomAmount();
			var preauthorization;
			shared.getToken().then( function(token) {
				return pmc.preauthorizations.createWithToken(token, amount, shared.currency);
			}).then(function(preauth) {
				//preauth created
				expect(preauth).to.be.ok();
				preauthorization = preauth;
				return pmc.transactions.createWithPreauthorization(preauthorization, amount, shared.currency, "test1234");
			}).then(function(transaction) {
				expect(transaction).to.be.a(pm.Transaction);
				expect(transaction.origin_amount).to.be(amount);
				expect(transaction.description).to.be("test1234");
				expect(transaction.currency).to.be(shared.currency);
				expect(transaction.client).to.be.a(pm.Client);
				expect(transaction.payment).to.be.a(pm.Payment);
				expect(transaction.payment.id).to.be(preauthorization.payment.id);
				expect(transaction.preauthorization).to.be.ok();
				expect(transaction.preauthorization.id).to.be(preauthorization.id);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

	});

	describe('Creator', function() {
		it('should create a transaction with preauthorization creator', function(done) {
			var amount = shared.randomAmount();
			var preauthorization;
			shared.getToken().then( function(token) {
				return pmc.preauthorizations.createWithToken(token, amount, shared.currency);
			}).then(function(preauth) {
				preauthorization = preauth;
				return pmc.transactions.fromPreauth(preauth,amount,shared.currency).create();
			}).then(function(transaction) {
				expect(transaction).to.be.a(pm.Transaction);
				expect(transaction.origin_amount).to.be(amount);
				expect(transaction.currency).to.be(shared.currency);
				expect(transaction.preauthorization.id).to.be(preauthorization.id);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

		it('should create a transaction with payment creator, client and mandate_reference', function(done) {
			var amount = shared.randomAmount();
			var payment;
			var client;
			shared.createClient().then( function(newclient) {
				client = newclient;
				return shared.getToken();
			}).then(function(token) {
				return pmc.payments.create(token, client.id);
			}).then(function(newpayment) {
				payment = newpayment;
				return pmc.transactions.fromPayment(payment,amount,shared.currency).withDescription("temp123").withClient(client).withMandateReference("DE1234").create();
			}).then(function(transaction) {
				expect(transaction).to.be.a(pm.Transaction);
				expect(transaction.origin_amount).to.be(amount);
				expect(transaction.currency).to.be(shared.currency);
				expect(transaction.payment.id).to.be(payment.id);
				expect(transaction.client.id).to.be(client.id);
				expect(transaction.mandate_reference).to.be("DE1234");
				expect(transaction.description).to.be("temp123");

			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

		it('should create a transaction with token creator', function(done) {
			var amount = shared.randomAmount();
			shared.getToken().then( function(token) {
				return pmc.transactions.fromToken(token, amount, shared.currency).create();
			}).then(function(transaction) {
				expect(transaction).to.be.a(pm.Transaction);
				expect(transaction.origin_amount).to.be(amount);
				expect(transaction.currency).to.be(shared.currency);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});

	describe('#refund()', function() {
		it('should refund a transaction', function(done) {
			var amount = shared.randomAmount();
			var transaction;
			shared.getToken().then( function(token) {
				return pmc.transactions.createWithToken(token, amount, shared.currency, "test1234");
			}).then(function(result) {
				transaction=result;
				expect(result).to.be.a(pm.Transaction);
				expect(result.origin_amount).to.be(amount);
				expect(result.description).to.be("test1234");
				expect(result.currency).to.be(shared.currency);
				expect(result.client).to.be.a(pm.Client);
				expect(result.payment).to.be.a(pm.Payment);
				expect(result.preauthorization).to.be(null);
				return pmc.transactions.refund(result,amount-1,"testrefund");
			}).then(function(refund) {
				expect(refund).to.be.a(pm.Refund);
				expect(refund.amount.toString()).to.be(""+ (amount-1));
				expect(refund.description).to.be("testrefund");
				expect(refund.transaction.id).to.be(transaction.id);
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
			pmc.transactions.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.transactions).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.transactions, pm.Transaction.Order.created_at().asc(), pm.Transaction.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createTransaction, pmc.transactions, (new pm.Transaction.Filter()), "amount").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	
	
	describe('#update()', function() {
		it('update and detail', function(done) {
			shared.verifyUpdate(shared.createTransaction, pmc.transactions, "description", "newdesc" + shared.randomAmount()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});
	describe('#detail()', function() {
		it('detail with id', function(done) {
			pmc.transactions.detail(someTransaction).then(function(result) {
				expect(result).to.be.a(pm.Transaction);
				expect(someTransaction).to.be(result);
				checkTransactionFields(result);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

		it('detail with node callback', function(done) {
			var id = someTransaction.id;
			pmc.transactions.detail(id, function(err, result) {
				expect(err).to.not.be.ok();
				expect(result.id).to.equal(id);
				done();
			});
		});
		it('detail with negative node callback', function(done) {
			var id = "1234";
			pmc.transactions.detail(id, function(err, result) {
				expect(err).to.be.ok();
				expect(result).to.not.be.ok();
				done();
			});
		});
	});
	
});

function compareTwoTransactionsWithoutDescription(one, two) {
	expect(one.id).to.equal(two.id);
	expect(one.amount).to.equal(two.amount);
	expect(one.client.id).to.equal(two.client.id);
	expect(one.created_at.getTime()).to.equal(two.created_at.getTime());
	expect(one.currency).to.equal(two.currency);
	expect(one.description).to.equal(two.description);
	expect(one.fees.length).to.equal(two.fees.length);
	expect(one.origin_amount).to.equal(two.origin_amount);
	expect(one.livemode).to.equal(two.livemode);
	expect(one.response_code).to.equal(two.response_code);
	expect(one.short_id).to.equal(two.short_id);
}

function checkTransactionFields(trans) {
	expect(trans.id).to.be.ok();
	expect(trans.amount).to.be.ok();
	expect(trans.origin_amount).to.be.ok();
	expect(trans.currency).to.be.ok();
	expect(trans.status).to.be.ok();
	expect(trans.description).to.be.ok();
	expect(trans.livemode).to.not.be(null);
	expect(trans.payment).to.be.ok();
	expect(trans.client).to.be.ok();
	expect(trans.created_at).to.be.ok();
	expect(trans.updated_at).to.be.ok();
	expect(trans.response_code).to.be.ok();
	expect(trans.invoices).to.be.ok();
	expect(trans.fees).to.be.ok();
}
