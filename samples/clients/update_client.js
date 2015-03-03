pm.clients.detail("client_88a388d9dd48f86c3136").then(function(client) {
	client.description = "My Updated Lovely Client";
	return pm.clients.update(client);
}).then(function(updatedClient) {
	console.log("updated client:" + updatedClient.description);
}, function(error) {
	console.log("couldnt update client:" + error);
});
