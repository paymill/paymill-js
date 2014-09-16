var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('Node promise', function() {

	it('should work with callback', function(done) {
		pmc.payments.create(shared.token, null, function(err, result) {
			expect(result).to.be.a(pm.Payment);
			done();
		});
	});
	it('should work with callback and promise', function(done) {
		var doneincb = false;
		var doneinpr = false;
		pmc.payments.create(shared.token, null, function(err, result) {
			if (err) {
				done(err);
			}
			expect(result).to.be.a(pm.Payment);
			doneincb = true;
			if (doneincb && doneinpr) {
				done();
			}
		}).then(function(result) {
			expect(result).to.be.a(pm.Payment);
			doneinpr = true;
			if (doneincb && doneinpr) {
				done();
			}
		}, function(err) {
			done(err);
		});
	});
});

describe('Deserialization', function() {
    it('should work with a transaction object', function() {
        var transaction = new pm.Transaction();
        transaction.fromJson(JSON.parse(transaction1));
        expect(transaction.id).to.equal("tran_54645bcb98ba7acfe204");
        expect(transaction.amount).to.be("4200");
        expect(transaction.created_at.getTime()/1000).to.be(1349946151);
        expect(transaction.fees[0].payment).to.be("pay_123");
        expect(transaction.invoices[0]).to.be("inv_1");
        expect(transaction.invoices[1]).to.be("inv_2");
        expect(transaction.client instanceof pm.Client).to.be(true);
        expect(transaction.client.email).to.be("lovely-client@example.com");
    });
});

describe('Deserialization', function() {
	it('should work with a transaction object', function() {
		var transaction = new pm.Transaction();
		transaction.fromJson(JSON.parse(transaction1));
		expect(transaction.id).to.equal("tran_54645bcb98ba7acfe204");
		expect(transaction.amount).to.be("4200");
		expect(transaction.created_at.getTime()/1000).to.be(1349946151);
		expect(transaction.fees[0].payment).to.be("pay_123");
		expect(transaction.invoices[0]).to.be("inv_1");
		expect(transaction.invoices[1]).to.be("inv_2");
		expect(transaction.client instanceof pm.Client).to.be(true);
		expect(transaction.client.email).to.be("lovely-client@example.com");
	});
});

var transaction1 = "{\n    \"id\" : \"tran_54645bcb98ba7acfe204\",\n    \"amount\" : \"4200\",\n    \"origin_amount\" : 4200,\n    \"status\" : \"closed\",\n    \"description\" : null,\n    \"livemode\" : false,\n    \"refunds\" : null,\n    \"currency\" : \"EUR\",\n    \"created_at\" : 1349946151,\n    \"updated_at\" : 1349946151,\n    \"response_code\" : 20000,\n    \"short_id\" : \"0000.1212.3434\",\n    \"invoices\" : [\"inv_1\",\"inv_2\"],\n    \"payment\" : \"<Object>\",\n    \"client\" : {\n    \"id\"           :  \"client_88a388d9dd48f86c3136\",\n    \"email\"        :  \"lovely-client@example.com\",\n    \"description\"  :  null,\n    \"created_at\"   :  1340199740,\n    \"updated_at\"   :  1340199760,\n    \"payment\"      :  null,\n    \"subscription\" :  null,\n    \"app_id\"       :  null\n},\n    \"preauthorization\" : null,\n    \"fees\" : [{\"type\":\"application\",\"amount\":40,\"application\":\"app_1234\",\"payment\":\"pay_123\"}],\n    \"app_id\" : null\n}";

