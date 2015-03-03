pm.clients.remove("client_88a388d9dd48f86c3136").then(function(client) {
	console.log("deleted client:" + client.id);
}, function(error) {
	console.log("couldnt get transaction:" + error);
});
