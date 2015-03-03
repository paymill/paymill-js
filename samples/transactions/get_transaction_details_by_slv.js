pm.transactions.detail("slv_4125875679").then(function(transaction) {
    console.log("transaction:" + transaction.id);
}, function(error) {
    console.log("couldnt get transaction:" + error);
});
