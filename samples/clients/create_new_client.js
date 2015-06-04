pm.clients.create("lovely-client@example.com", "Lovely Client").then(function(client) {
    console.log("client:" + client.id);
}, function(error) {
    console.log("couldnt get client:" + error);
});
