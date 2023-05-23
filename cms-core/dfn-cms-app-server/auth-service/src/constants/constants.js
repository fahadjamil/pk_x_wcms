const responseCodes = {
    success: 1,
    actionFailed: -1,
    validationError: -2,
    exception: -3,
};

const subscriptionStatus = {
    activetePending: 3,
    updatePending: 2,
    active: 1,
    pending: 0,
    expired: -1,
    unsubscribed: -2,
};

const loginActivationStatus = {
    active: 1,
    suspended: 2,
    pending: 3,
    expired: 4,
};

const purchaseTransactionStatus = {
    sendToPayment: 2,
    success: 1,
    urlSendToUser: 0,
    failed: -1,
    paymentSuccessSubscriptionFailToUpdate: -2,
};

const purchaseTransactionStatusDec = {
    sendToPayment: 'send to payment',
    success: 'success',
    urlSendToUser: 'url send to user',
    failed: 'fail',
    paymentSuccessSubscriptionFailToUpdate: 'payment success subscription fail to update',
};

module.exports = {
    responseCodes: responseCodes,
    subscriptionStatus: subscriptionStatus,
    loginActivationStatus: loginActivationStatus,
    purchaseTransactionStatus: purchaseTransactionStatus,
    purchaseTransactionStatusDec: purchaseTransactionStatusDec,
};
