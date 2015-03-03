pm.clients.create("max.mustermann@example.com", "Lovely Client").then(function(client) {
    console.log("client:" + client.id);
}, function(error) {
    console.log("couldnt get client:" + error);
});
