var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('ChecksumService', function() {
	var someClient;

	describe('#create()', function() {
		it('with creator', function(done) {
			var amount = shared.randomAmount();
			var return_url = "http://www." + shared.randomDescription() + ".com";
			var cancel_url = "http://www." + shared.randomDescription() + ".com";
			pmc.checksums.forPaypal(amount, shared.currency, return_url, cancel_url).create().then(function(result) {
				expect(result).to.be.a(pm.Checksum);
				expect(result.checksum).not.to.be.empty;
				expect(result.data).to.have.string(amount);
				expect(result.data).to.have.string(encodeURIComponent(return_url));
				expect(result.data).to.have.string(encodeURIComponent(cancel_url));
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

		it('with creator', function(done) {
			var description = shared.randomDescription();
			var amount = shared.randomAmount();
			var return_url = "http://www." + shared.randomDescription() + ".com";
			var cancel_url = "http://www." + shared.randomDescription() + ".com";
			var billing = new pm.Address();
			billing.postal_code = shared.randomAmount();
			var shipping = new pm.Address();
			shipping.postal_code = shared.randomAmount();
			var items = [];
			items[0] = new pm.ShoppingCartItem();
			items[1] = new pm.ShoppingCartItem();
			items[0].name = shared.randomDescription();
			items[1].name = shared.randomDescription();
			pmc.checksums.forPaypal(amount, shared.currency, return_url, cancel_url).withBillingAddress(billing).withShippingAddress(shipping).withDescription(description).withItems(items).create().then(function(result) {
				expect(result).to.be.a(pm.Checksum);
				expect(result.checksum).not.to.be.empty;
				expect(result.data).to.have.string(amount);
				expect(result.data).to.have.string(encodeURIComponent(return_url));
				expect(result.data).to.have.string(encodeURIComponent(cancel_url));
				expect(result.data).to.have.string(encodeURIComponent(description));
				expect(result.data).to.have.string(encodeURIComponent(items[0].name));
				expect(result.data).to.have.string(encodeURIComponent(items[1].name));
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});

	});
});
