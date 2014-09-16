var shared = require("../test/shared.js");
var pm = shared.pm;
var pmc = shared.pmc;
var expect = require("expect.js");

describe('ClientService', function() {
	var someClient;

	describe('#create()', function() {
		it('should create a Client with email and description', function(done) {
			var description = shared.randomDescription();
			var email = "user" + shared.randomAmount() + "@test.com";
			pmc.clients.create(email, description).then(function(result) {
				expect(result).to.be.a(pm.Client);
				checkClientFields(result);
				expect(result.email).to.be(email);
				expect(result.description).to.be(description);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
		it('should create a Client with email', function(done) {
			var description = shared.randomDescription();
			var email = "user" + shared.randomAmount() + "@test.com";
			pmc.clients.create(email, description).then(function(result) {
				expect(result).to.be.a(pm.Client);
				checkClientFields(result);
				expect(result.email).to.be(email);
				expect(result.description).to.be(description);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
			;
		});
		it('should create a Client without params', function(done) {
			var description = shared.randomDescription();
			var email = "user" + shared.randomAmount() + "@test.com";
			pmc.clients.create().then(function(result) {
				expect(result).to.be.a(pm.Client);
				checkClientFields(result);
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
			pmc.clients.list().then(function(result) {
				expect(result).to.be.a(pm.PaymillList);
			}).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work with offset and count', function(done) {
			shared.verifyListCountOffset(pmc.clients).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
		it('list should work  with order', function(done) {
			var firstId;
			shared.verifyListOrderChanged(pmc.clients, pm.Client.Order.created_at().asc(), pm.Client.Order.created_at().desc()).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

		it('list should work with filter', function(done) {
			shared.verifyListFilter(shared.createClient, pmc.clients, (new pm.Client.Filter()), "email").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});

	});
	describe('#remove()', function() {
		it('with id', function(done) {
			shared.verifyRemoveWithDetail(shared.createClient, pmc.clients, pm.Client).then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});

	describe('#update()', function() {
		it('update and detail', function(done) {
			shared.verifyUpdate(shared.createClient, pmc.clients, "email", "email123@test.com").then(function() {
				done();
			}, function(err) {
				done(err);
			});
		});
	});
});
function checkClientFields(target) {
	expect(target.id).to.be.ok();
	expect(target.created_at).to.be.ok();
	expect(target.updated_at).to.be.ok();
}
