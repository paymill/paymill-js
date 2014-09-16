var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('Regression tests', function() {
    var someClient;

    describe('detail call', function() {
        it('should refresh an instance', function(done) {
            var description = shared.randomDescription();
            var email = "user" + shared.randomAmount() + "@test.com";
            var updatedEmail = "123"+email;
            var client = null;
            pmc.clients.create(email, description).then(function(result) {
                expect(result.email).to.be(email);
                client = result;
                return pmc.clients.detail(result.id);
            }).then(function(result) {
                result.email=updatedEmail;
                return pmc.clients.update(result);
            }).then(function(result) {
                return pmc.clients.detail(client);
            }).then(function(result) {
                expect(result.email).to.be(updatedEmail);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
            ;
        });
    });

    describe('client and payment deserialization', function() {
        it('should work with recursive objects and have only ids', function(done) {
            var client;
            pmc.clients.create().then(function(result) {
                client = result;
                return shared.createPayment(client);
            }).then(function(result) {
                return pmc.clients.detail(client);
            }).then(function(result) {
                expect(client.payment).to.be.an('array');
                expect(client.payment[0]).to.be.an(pm.Payment);
                expect(client.payment[0].client).to.be(client.id);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
            ;
        });
    });
    describe('list filter with amount', function() {
        it('should work', function(done) {
            var amount = shared.randomAmount();
            pmc.transactions.createWithToken(shared.token, amount, shared.currency, "test1234").then(function(transaction) {
                return pmc.transactions.list(null,null, (new pm.Transaction.Filter()).amount(amount))
            }).then(function(list) {
                expect(list.items[0].amount).to.be(amount);
            }).then(function() {
                done();
            }, function(err) {
                done(err);
            });
            ;
        });
    });
});