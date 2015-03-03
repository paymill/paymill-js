pm.payments.detail("pay_3af44644dd6d25c820a8").then(function(payment) {
    console.log("payment:" + payment.id);
}, function(error) {
    console.log("couldnt get payment:" + error);
});
