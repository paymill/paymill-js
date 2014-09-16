var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('WebhookService', function() {
	this.timeout(5000);
	describe('#create()', function() {
		it('should create an email webhook', function(done) {
			shared.createEmailWebhook().then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('should create an url webhook', function(done) {
			shared.createUrlWebhook().then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});
	describe('#list()', function() {
		it('list should work with no params', function(done) {
			pmc.webhooks.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.webhooks).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work  with url order', function(done) {
			shared.verifyListOrderChanged(pmc.webhooks, pm.Webhook.Order.url().asc(), pm.Webhook.Order.url().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createEmailWebhook, pmc.webhooks, (new pm.Webhook.Filter()), "email").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});

	it('remove()', function() {
		it('with id', function(done) {
			shared.verifyRemoveWithDetail(shared.createEmailWebhook, pmc.webhooks, pm.Webhook).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#update()', function() {
		it('update and detail', function(done) {
			shared.verifyUpdate(shared.createEmailWebhook, pmc.webhooks, "email", "testemail123@test.com").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

});