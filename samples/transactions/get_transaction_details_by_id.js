pm.transactions.detail("tran_023d3b5769321c649435").then(function(transaction) {
    console.log("transaction:" + transaction.id);
}, function(error) {
    console.log("couldnt get transaction:" + error);
});
