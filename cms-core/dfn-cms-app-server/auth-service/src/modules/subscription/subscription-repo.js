const logger = require('../../logger/logger').logger;
const dbDriver = require('universal-db-driver').DBPersistanceByType('mssql');
const dbQueries = require('../../constants/db-queries').dbQueries;
const storedProcedures = require('../../constants/db-queries').storedProcedures;
const {
    responseCodes,
    subscriptionStatus,
    purchaseTransactionStatus,
    purchaseTransactionStatusDec,
} = require('../../constants/constants');
const { PAYMENT_APP_ENDPOINT } = require('../../config/config');

async function productDetails(loginId) {
    const products = await dbDriver.executeQuery(dbQueries.selectProducts, []);
    const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);
    const subGroups = await dbDriver.executeQuery(dbQueries.selectSubGroups, []);
    const periods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);
    const fees = await dbDriver.executeQuery(dbQueries.selectFees, []);

    const subscriptionParams = [{ param: 'loginId', value: loginId }];
    const subscriptions = await dbDriver.executeQuery(
        dbQueries.selectUserActiveSubscriptions,
        subscriptionParams
    );

    if (
        products === -1 ||
        groups === -1 ||
        subGroups === -1 ||
        periods === -1 ||
        fees === -1 ||
        subscriptions === -1
    ) {
        return { code: responseCodes.exception, message: 'DB connection error' };
    } else if (products && groups && subGroups && periods && fees && subscriptions) {
        return {
            code: responseCodes.success,
            products: products.recordset,
            groups: groups.recordset,
            'sub-groups': subGroups.recordset,
            periods: periods.recordset,
            fees: fees.recordset,
            subscriptions: subscriptions.recordset,
        };
    } else {
        return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
    }
}

async function productSubscriptionTest(loginId, paybleAmount, newSubscriptions, httpBroker) {
    //KNET INTEGRATION BEGIN
    // Add New

    const trackId = getTransactionCode(loginId, new Date());

    const params = [
        { param: 'trackId', value: trackId },
        { param: 'login', value: loginId },
        { param: 'amount', value: paybleAmount },
        { param: 'status', value: purchaseTransactionStatus.sendToPayment },
        { param: 'createdDate', value: new Date() },
    ];

    // const result = await dbDriver.executeQuery(dbQueries.addPurchaseTransaction, params);

    // logger.info('Purchase data added to database ' + result + ', track id ' + trackId);
    // return { message: 'Transaction succccccc' };

    const response = await httpBroker
        .call('http.get', {
            url:
                'http://' +
                PAYMENT_APP_ENDPOINT +
                '/api/payment/purchase?trackId=' +
                trackId +
                '&amount=' +
                paybleAmount,
        })
        .catch((err) => {
            console.log('Purchase spring boot exception ' + err + ', track id ' + trackId);

            const params = [
                { param: 'trackId', value: trackId },
                { param: 'login', value: loginId },
                { param: 'status', value: purchaseTransactionStatus.failed },
            ];

            // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);
            return { code: responseCodes.actionFailed, message: 'Transaction error' };
        });

    let body = JSON.parse(response.body);
    console.log('Body ======== ', body);

    if (body.hasOwnProperty('error') && body.error) {
        // console.log('Error : ' + body.webAddress + ', track id ' + body.trackId);
        const params = [
            { param: 'trackId', value: trackId },
            { param: 'login', value: loginId },
            { param: 'status', value: purchaseTransactionStatus.failed },
        ];

        // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);
        return { code: responseCodes.actionFailed, message: 'Transaction error' };
    } else {
        console.log('Success : ' + body.webAddress + ', track id {} ' + body.trackId);
        const params = [
            { param: 'trackId', value: trackId },
            { param: 'login', value: loginId },
            { param: 'status', value: purchaseTransactionStatus.pending },
        ];
        // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);

        let res = {
            code: responseCodes.success,
            transaction_code: trackId,
            transaction_fee: paybleAmount,
            response_url: body.webAddress,
            message: 'Transaction success',
        };

        console.log('Res', res);

        return res;
    }
    console.log('============================');

    return response.body;

    httpBroker
        .call('http.get', {
            url:
                'http://' +
                '127.0.0.1:8080' +
                '/api/payment/purchase?trackId=' +
                trackId +
                '&amount=' +
                paybleAmount,
        })
        .then((data) => {
            // console.log('Data ' + JSON.stringify(data.body) + ', track id ' + trackId);
            let body = JSON.parse(data.body);

            if (body.hasOwnProperty('error') && body.error) {
                // console.log('Error : ' + body.webAddress + ', track id ' + body.trackId);
                const params = [
                    { param: 'trackId', value: trackId },
                    { param: 'login', value: loginId },
                    { param: 'status', value: purchaseTransactionStatus.failed },
                ];

                // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);
                return { code: responseCodes.actionFailed, message: 'Transaction error' };
            } else {
                // console.log('Success : ' + body.webAddress + ', track id {} ' + body.trackId);
                const params = [
                    { param: 'trackId', value: trackId },
                    { param: 'login', value: loginId },
                    { param: 'status', value: purchaseTransactionStatus.pending },
                ];
                // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);

                let res = {
                    code: responseCodes.success,
                    transaction_code: trackId,
                    transaction_fee: paybleAmount,
                    response_url: body.webAddress,
                    message: 'Transaction success',
                };

                console.log('Res', res);

                return res;
            }
        })
        .catch((err) => {
            console.log('Purchase springboot exception ' + err + ', track id ' + trackId);

            const params = [
                { param: 'trackId', value: trackId },
                { param: 'login', value: loginId },
                { param: 'status', value: purchaseTransactionStatus.failed },
            ];

            // const result = await dbDriver.executeQuery(dbQueries.updatePurchaseResponse, params);
            return { code: responseCodes.actionFailed, message: 'Transaction error' };
        });
    console.log('============================');
}

async function productSubscription(loginId, paybleAmount, newSubscriptions, httpBroker, lang) {
    if (loginId) {
        let transactionSuccess = true;
        const transactionCode = getTransactionCode(loginId, new Date());

        let oldActiveMap = new Map();
        let oldAllMap = new Map();
        let newMap = new Map();

        const products = await dbDriver.executeQuery(dbQueries.selectProducts, []);
        const fees = await dbDriver.executeQuery(dbQueries.selectFees, []);

        let prodMap = new Map();

        fees.recordset.forEach((element) => {
            let feeMap = new Map();
            feeMap.set(element.PERIOD_ID, element.FEE);
            prodMap.set(element.PRODUCT_ID, feeMap);
        });

        const userSubscriptionParams = [{ param: 'loginId', value: loginId.toString() }];
        const oldActiveSubscriptions = await dbDriver.executeQuery(
            dbQueries.selectUserActiveSubscriptions,
            userSubscriptionParams
        );

        const oldAllSubscriptions = await dbDriver.executeQuery(
            dbQueries.selectUserSubscriptions,
            userSubscriptionParams
        );

        oldActiveSubscriptions.recordset.forEach((element) => {
            oldActiveMap.set(element.PRODUCT_ID, element.PERIOD_ID);
        });

        oldAllSubscriptions.recordset.forEach((element) => {
            oldAllMap.set(element.PRODUCT_ID, element.PERIOD_ID);
        });

        newSubscriptions.forEach((element) => {
            newMap.set(element.PRODUCT_ID, element.PERIOD_ID);
        });

        // --- Fee validation
        // let transactionFee = 0;

        // for (const product of products.recordset) {
        //     if (oldActiveMap.has(product.PRODUCT_ID)) {
        //         if (oldActiveMap.get(product.PRODUCT_ID) < newMap.get(product.PRODUCT_ID)) {
        //             // Upgrade (Extend)
        //         }
        //     } else if (newMap.has(product.PRODUCT_ID)) {
        //         //New Subscription
        //     }
        // }
        // -------------------

        for (const product of products.recordset) {
            if (oldAllMap.has(product.PRODUCT_ID)) {
                if (oldActiveMap.has(product.PRODUCT_ID)) {
                    if (newMap.has(product.PRODUCT_ID)) {
                        if (oldActiveMap.get(product.PRODUCT_ID) < newMap.get(product.PRODUCT_ID)) {
                            // Upgrade / Extend
                            const params = [
                                { param: 'login', value: loginId },
                                { param: 'product', value: product.PRODUCT_ID },
                                { param: 'renewStatus', value: subscriptionStatus.updatePending }, // TODO: set status updatePending
                                { param: 'renewPeriod', value: newMap.get(product.PRODUCT_ID) },
                                {
                                    param: 'renewExpiryDate',
                                    value: getExpiryDate(
                                        newMap.get(product.PRODUCT_ID),
                                        new Date()
                                    ), // TODO: Set old expire date
                                },
                                { param: 'transCode', value: transactionCode },
                            ];

                            const result = await dbDriver.executeQuery(
                                dbQueries.renewSubscriptionTemp, // TODO: Use renewSubscription
                                params
                            );

                            if (result && result !== -1) {
                                const auditParams = [
                                    { param: 'loginId', value: loginId },
                                    { param: 'productId', value: product.PRODUCT_ID },
                                    { param: 'periodId', value: newMap.get(product.PRODUCT_ID) },
                                    { param: 'fromDate', value: new Date() },
                                    {
                                        param: 'toDate',
                                        value: getExpiryDate(
                                            newMap.get(product.PRODUCT_ID),
                                            new Date()
                                        ), // TODO: Set old expire date
                                    },
                                    { param: 'statusId', value: subscriptionStatus.pending }, // TODO: Set status pending
                                    { param: 'status', value: 'Pending' }, // TODO: Set status Pending
                                    { param: 'action', value: 'Extended' },
                                    { param: 'transCode', value: transactionCode },
                                ];

                                const auditResult = await dbDriver.executeQuery(
                                    dbQueries.subscriptionAudit,
                                    auditParams
                                );
                            } else {
                                transactionSuccess = false;
                                break;
                            }
                        } else if (
                            oldActiveMap.get(product.PRODUCT_ID) > newMap.get(product.PRODUCT_ID)
                        ) {
                            // Downgrade : Not support
                        }
                    } else {
                        // Deactivate / Unsubscribe
                        const params = [
                            { param: 'login', value: loginId },
                            { param: 'product', value: product.PRODUCT_ID },
                            { param: 'unsubStatus', value: subscriptionStatus.unsubscribed },
                            { param: 'unsubDate', value: new Date() },
                        ];

                        const result = await dbDriver.executeQuery(dbQueries.unsubscribe, params);

                        if (result && result !== -1) {
                            const auditParams = [
                                { param: 'loginId', value: loginId },
                                { param: 'productId', value: product.PRODUCT_ID },
                                { param: 'fromDate', value: new Date() },
                                { param: 'statusId', value: subscriptionStatus.unsubscribed },
                                { param: 'status', value: 'Unsubscribed' },
                                { param: 'action', value: 'Unsubscribed' },
                            ];

                            const auditResult = await dbDriver.executeQuery(
                                dbQueries.unsubscribeAudit,
                                auditParams
                            );
                        } else {
                            transactionSuccess = false;
                            break;
                        }
                    }
                } else if (newMap.has(product.PRODUCT_ID)) {
                    // Re Activate
                    const params = [
                        { param: 'login', value: loginId },
                        { param: 'product', value: product.PRODUCT_ID },
                        { param: 'renewStatus', value: subscriptionStatus.activetePending }, // TODO: set status activetePending
                        { param: 'renewPeriod', value: newMap.get(product.PRODUCT_ID) },
                        {
                            param: 'renewExpiryDate',
                            value: getExpiryDate(newMap.get(product.PRODUCT_ID), new Date()),
                        },
                        { param: 'transCode', value: transactionCode },
                    ];

                    const result = await dbDriver.executeQuery(
                        dbQueries.renewSubscriptionTemp, // TODO: Use renewSubscription
                        params
                    );

                    if (result && result !== -1) {
                        const auditParams = [
                            { param: 'loginId', value: loginId },
                            { param: 'productId', value: product.PRODUCT_ID },
                            { param: 'periodId', value: newMap.get(product.PRODUCT_ID) },
                            { param: 'fromDate', value: new Date() },
                            {
                                param: 'toDate',
                                value: getExpiryDate(newMap.get(product.PRODUCT_ID), new Date()),
                            },
                            { param: 'statusId', value: subscriptionStatus.pending }, // TODO: Set status pending
                            { param: 'status', value: 'Pending' }, // TODO: Set status Pending
                            { param: 'action', value: 'Re activated' },
                            { param: 'transCode', value: transactionCode },
                        ];

                        const auditResult = await dbDriver.executeQuery(
                            dbQueries.subscriptionAudit,
                            auditParams
                        );
                    } else {
                        transactionSuccess = false;
                        break;
                    }
                }
            } else if (newMap.has(product.PRODUCT_ID)) {
                // Add New
                const params = [
                    { param: 'login', value: loginId },
                    { param: 'product', value: product.PRODUCT_ID },
                    { param: 'period', value: newMap.get(product.PRODUCT_ID) },
                    { param: 'status', value: subscriptionStatus.pending }, // TODO: Set status pending
                    { param: 'subscribeDate', value: new Date() },
                    {
                        param: 'expiryDate',
                        value: getExpiryDate(newMap.get(product.PRODUCT_ID), new Date()),
                    },
                    { param: 'transCode', value: transactionCode },
                ];

                const result = await dbDriver.executeQuery(dbQueries.addSubscription, params);

                if (result && result !== -1) {
                    const auditParams = [
                        { param: 'loginId', value: loginId },
                        { param: 'productId', value: product.PRODUCT_ID },
                        { param: 'periodId', value: newMap.get(product.PRODUCT_ID) },
                        { param: 'fromDate', value: new Date() },
                        {
                            param: 'toDate',
                            value: getExpiryDate(newMap.get(product.PRODUCT_ID), new Date()),
                        },
                        { param: 'statusId', value: subscriptionStatus.pending }, // TODO: Set status pending
                        { param: 'status', value: 'Pending' }, // TODO: Set status Pending
                        { param: 'action', value: 'New subscription added' },
                        { param: 'transCode', value: transactionCode },
                    ];

                    const auditResult = await dbDriver.executeQuery(
                        dbQueries.subscriptionAudit,
                        auditParams
                    );
                    // if (auditResult && auditResult !== -1) {
                    // } else {
                    // }
                } else {
                    transactionSuccess = false;
                    break;
                }
            }
        }

        if (transactionSuccess) {
            //KNET INTEGRATION BEGIN
            // Add New
            const trackId = transactionCode;
            const params = [
                { param: 'trackId', value: trackId },
                { param: 'login', value: loginId },
                { param: 'amount', value: paybleAmount },
                { param: 'createdDate', value: new Date() },
                { param: 'status', value: purchaseTransactionStatus.sendToPayment },
                { param: 'statusDescription', value: purchaseTransactionStatusDec.sendToPayment },
            ];

            const result = await dbDriver.executeQuery(dbQueries.addPurchaseTransaction, params);
            if (result && result !== -1) {
                logger.info(
                    '1 | Purchase data added to database ' + result + ', track id ' + trackId
                );
            } else {
                logger.info(
                    '-1 | Purchase data error when add to database ' +
                        result +
                        ', track id ' +
                        trackId
                );
                return { code: responseCodes.actionFailed, message: 'Transaction error' };
            }

            const response = await httpBroker
                .call('http.get', {
                    url:
                        'http://' +
                        PAYMENT_APP_ENDPOINT +
                        '/api/payment/purchase?trackId=' +
                        trackId +
                        '&amount=' +
                        paybleAmount +
                        '&lang=' +
                        lang,
                })
                .catch(async (err) => {
                    logger.info('Purchase spring boot exception ' + err + ', track id ' + trackId);

                    const params = [
                        { param: 'trackId', value: trackId },
                        { param: 'login', value: loginId },
                        { param: 'status', value: purchaseTransactionStatus.failed },
                        { param: 'statusDescription', value: purchaseTransactionStatusDec.failed },
                    ];

                    const result = await dbDriver.executeQuery(
                        dbQueries.updatePurchaseResponse,
                        params
                    );

                    if (result && result !== -1) {
                        logger.info(
                            '2 | Purchase data added to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    } else {
                        logger.info(
                            '-2 | Purchase data error when add to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    }
                    return { code: responseCodes.actionFailed, message: 'Transaction error' };
                });

            if (response && response.body) {
                let body = JSON.parse(response.body);
                logger.info('Body ' + body + ', track id' + trackId);
                if (body.hasOwnProperty('error') && body.error) {
                    logger.info('Error from knet response' + body.error + ', track id' + trackId);
                    const params = [
                        { param: 'trackId', value: trackId },
                        { param: 'login', value: loginId },
                        { param: 'status', value: purchaseTransactionStatus.failed },
                        { param: 'statusDescription', value: purchaseTransactionStatusDec.failed },
                    ];

                    const result = await dbDriver.executeQuery(
                        dbQueries.updatePurchaseResponse,
                        params
                    );

                    if (result && result !== -1) {
                        logger.info(
                            '3 | Purchase data added to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    } else {
                        logger.info(
                            '-3 | Purchase data error when add to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    }

                    return { code: responseCodes.actionFailed, message: 'Transaction error' };
                } else {
                    logger.info('Success ' + body.webAddress + ', track id ' + trackId);
                    const params = [
                        { param: 'trackId', value: trackId },
                        { param: 'login', value: loginId },
                        { param: 'status', value: purchaseTransactionStatus.urlSendToUser },
                        {
                            param: 'statusDescription',
                            value: purchaseTransactionStatusDec.urlSendToUser,
                        },
                    ];
                    const result = await dbDriver.executeQuery(
                        dbQueries.updatePurchaseResponse,
                        params
                    );
                    if (result && result !== -1) {
                        logger.info(
                            '4 | Purchase data added to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    } else {
                        logger.info(
                            '-4 | Purchase data error when add to database ' +
                                result +
                                ', track id ' +
                                trackId
                        );
                    }

                    return {
                        code: responseCodes.success,
                        transaction_code: transactionCode,
                        transaction_fee: paybleAmount,
                        response_url: body.webAddress,
                        message: 'Transaction success',
                    };
                }
            } else {
                return { code: responseCodes.actionFailed, message: 'Transaction error' };
            }
        } else {
            return { code: responseCodes.actionFailed, message: 'Transaction error' };
        }
    } else {
        return { code: responseCodes.actionFailed, message: 'Transaction Error' };
    }
}

function getExpiryDate(periodId, toDate) {
    switch (parseInt(periodId)) {
        case 1: // One Day
            toDate.setDate(toDate.getDate() + 1);
            break;
        case 2: // Week
            toDate.setDate(toDate.getDate() + 7);
            break;
        case 3: // One month
            toDate.setMonth(toDate.getMonth() + 1);
            break;
        case 4: // Three Months
            toDate.setMonth(toDate.getMonth() + 3);
            break;
        case 5: // Six Months
            toDate.setMonth(toDate.getMonth() + 6);
            break;
        case 6: // One Year
            toDate.setFullYear(toDate.getFullYear() + 1);
            break;
    }

    return toDate;
}

function getTransactionCode(loginId, now) {
    let code = loginId.toString().padStart(5, '0');

    code += now.getFullYear().toString();
    code += (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1).toString();
    code += (now.getDate() < 10 ? '0' : '') + now.getDate().toString();
    code += (now.getHours() < 10 ? '0' : '') + now.getHours().toString();
    code += (now.getMinutes() < 10 ? '0' : '') + now.getMinutes().toString();
    code += (now.getSeconds() < 10 ? '0' : '') + now.getSeconds().toString();

    return code;
}

async function getAllProducts() {
    try {
        const products = await dbDriver.executeQuery(dbQueries.selectProductDetails, []);

        if (products === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (products === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            products: products.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProducts - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllProductSubGroups() {
    try {
        const subGroups = await dbDriver.executeQuery(dbQueries.selectProductSubGroupDetails, []);

        if (subGroups === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subGroups === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subGroups: subGroups.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProductSubGroups - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllProductGroups() {
    try {
        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);

        if (groups === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (groups === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            groups: groups.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProductGroups - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllProductSubscriptionPeriods() {
    try {
        const subPeriods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);

        if (subPeriods === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subPeriods === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subscriptionPeriods: subPeriods.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProductSubscriptionPeriods - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllProductSubscriptions() {
    try {
        const productSubscriptions = await dbDriver.executeQuery(dbQueries.selectSubscriptions, []);

        if (productSubscriptions === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (productSubscriptions === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subscriptions: productSubscriptions.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProductSubscriptions - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllPurchaseTransactions() {
    try {
        const purchaseTransactions = await dbDriver.executeQuery(
            dbQueries.selectPurchaseTransactions,
            []
        );

        if (purchaseTransactions === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (purchaseTransactions === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            purchaseTransactions: purchaseTransactions.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllPurchaseTransactions - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllPurchaseTransactionsByFilter(filter) {
    try {
        let query = dbQueries.selectPurchaseTransactions;
        const params = [];

        if (filter && Object.keys(filter).length > 0) {
            const modifiedFilter = JSON.parse(filter);
            query = query.replace('ORDER BY CREATED_DATE DESC;', '');

            if (modifiedFilter.trackIdFilter && modifiedFilter.trackIdFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'TRACK_ID = @trackId ';
                    params.push({ param: 'trackId', value: modifiedFilter.trackIdFilter });
                } else {
                    query += 'AND TRACK_ID = @trackId ';
                    params.push({ param: 'trackId', value: modifiedFilter.trackIdFilter });
                }
            }

            if (modifiedFilter.paymentIdFilter && modifiedFilter.paymentIdFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'PAYMENT_ID = @paymentId ';
                    params.push({ param: 'paymentId', value: modifiedFilter.paymentIdFilter });
                } else {
                    query += 'AND PAYMENT_ID = @paymentId ';
                    params.push({ param: 'paymentId', value: modifiedFilter.paymentIdFilter });
                }
            }

            if (modifiedFilter.trancactionIdFilter && modifiedFilter.trancactionIdFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'TRANSACTION_ID = @transactionId ';
                    params.push({
                        param: 'transactionId',
                        value: modifiedFilter.trancactionIdFilter,
                    });
                } else {
                    query += 'AND TRANSACTION_ID = @transactionId ';
                    params.push({
                        param: 'transactionId',
                        value: modifiedFilter.trancactionIdFilter,
                    });
                }
            }

            if (modifiedFilter.referenceIdFilter && modifiedFilter.referenceIdFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'REFERENCE_ID = @referenceId ';
                    params.push({ param: 'referenceId', value: modifiedFilter.referenceIdFilter });
                } else {
                    query += 'AND REFERENCE_ID = @referenceId ';
                    params.push({ param: 'referenceId', value: modifiedFilter.referenceIdFilter });
                }
            }

            if (modifiedFilter.status && modifiedFilter.status.length > 0) {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += `STATUS IN (${modifiedFilter.status.join(', ')}) `;
                } else {
                    query += `AND STATUS IN (${modifiedFilter.status.join(', ')}) `;
                }
            }

            if (modifiedFilter.loginName && modifiedFilter.loginName !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'S02_USER_LOGINS.S02_LOGINNAME = @loginName ';
                    params.push({ param: 'loginName', value: modifiedFilter.loginName });
                } else {
                    query += 'AND S02_USER_LOGINS.S02_LOGINNAME = @loginName ';
                    params.push({ param: 'loginName', value: modifiedFilter.loginName });
                }
            }

            if (modifiedFilter.created && Object.keys(modifiedFilter.created).length == 2) {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'CREATED_DATE BETWEEN @createdFrom AND @createdTo ';
                    params.push({
                        param: 'createdFrom',
                        value: modifiedFilter.created.fromDate,
                    });
                    params.push({ param: 'createdTo', value: modifiedFilter.created.toDate });
                } else {
                    query += 'AND CREATED_DATE BETWEEN @createdFrom AND @createdTo ';
                    params.push({
                        param: 'createdFrom',
                        value: modifiedFilter.created.fromDate,
                    });
                    params.push({ param: 'createdTo', value: modifiedFilter.created.toDate });
                }
            }

            query += 'ORDER BY CREATED_DATE DESC;';
        }

        const purchaseTransactions = await dbDriver.executeQuery(query, params);

        if (purchaseTransactions === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (purchaseTransactions === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            purchaseTransactions: purchaseTransactions.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllPurchaseTransactionsByFilter - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getAllProductSubscriptionsByFilter(filter) {
    try {
        let query = dbQueries.selectSubscriptions;
        const params = [];

        if (filter && Object.keys(filter).length > 0) {
            const modifiedFilter = JSON.parse(filter);
            query = query.replace('ORDER BY SUBSCRIPTION_ID DESC;', '');

            if (modifiedFilter.productFilter && modifiedFilter.productFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'PRODUCT_SUBSCRIPTIONS.PRODUCT_ID = @product ';
                    params.push({ param: 'product', value: modifiedFilter.productFilter });
                } else {
                    query += 'AND PRODUCT_SUBSCRIPTIONS.PRODUCT_ID = @product ';
                    params.push({ param: 'product', value: modifiedFilter.productFilter });
                }
            }

            if (modifiedFilter.loginNameFilter && modifiedFilter.loginNameFilter !== '') {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'S02_USER_LOGINS.S02_LOGINNAME = @loginName ';
                    params.push({ param: 'loginName', value: modifiedFilter.loginNameFilter });
                } else {
                    query += 'AND S02_USER_LOGINS.S02_LOGINNAME = @loginName ';
                    params.push({ param: 'loginName', value: modifiedFilter.loginNameFilter });
                }
            }

            if (
                modifiedFilter.transactionCodeFilter &&
                modifiedFilter.transactionCodeFilter !== ''
            ) {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'TRANSACTION_CODE = @transactionCode ';
                    params.push({
                        param: 'transactionCode',
                        value: modifiedFilter.transactionCodeFilter,
                    });
                } else {
                    query += 'AND TRANSACTION_CODE = @transactionCode ';
                    params.push({
                        param: 'transactionCode',
                        value: modifiedFilter.transactionCodeFilter,
                    });
                }
            }

            if (modifiedFilter.subscribed && Object.keys(modifiedFilter.subscribed).length == 2) {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'SUBSCRIBED_DATE BETWEEN @subscribedFrom AND @subscribedTo ';
                    params.push({
                        param: 'subscribedFrom',
                        value: modifiedFilter.subscribed.fromDate,
                    });
                    params.push({ param: 'subscribedTo', value: modifiedFilter.subscribed.toDate });
                } else {
                    query += 'AND SUBSCRIBED_DATE BETWEEN @subscribedFrom AND @subscribedTo ';
                    params.push({
                        param: 'subscribedFrom',
                        value: modifiedFilter.subscribed.fromDate,
                    });
                    params.push({ param: 'subscribedTo', value: modifiedFilter.subscribed.toDate });
                }
            }

            if (modifiedFilter.expiry && Object.keys(modifiedFilter.expiry).length == 2) {
                if (query.search('WHERE') === -1) {
                    query += ' WHERE ';
                    query += 'EXPIRY_DATE BETWEEN @expiryFrom AND @expiryTo ';
                    params.push({ param: 'expiryFrom', value: modifiedFilter.expiry.fromDate });
                    params.push({ param: 'expiryTo', value: modifiedFilter.expiry.toDate });
                } else {
                    query += 'AND EXPIRY_DATE BETWEEN @expiryFrom AND @expiryTo ';
                    params.push({ param: 'expiryFrom', value: modifiedFilter.expiry.fromDate });
                    params.push({ param: 'expiryTo', value: modifiedFilter.expiry.toDate });
                }
            }

            query += 'ORDER BY SUBSCRIPTION_ID DESC;';
        }

        const productSubscriptions = await dbDriver.executeQuery(query, params);

        if (productSubscriptions === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (productSubscriptions === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subscriptions: productSubscriptions.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getAllProductSubscriptionsByFilter - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getProduct(productId) {
    try {
        const dbQueryParams = [{ param: 'productId', value: productId }];
        const product = await dbDriver.executeQuery(
            dbQueries.selectProductDetailsById,
            dbQueryParams
        );

        if (product === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (product === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            product: product.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getProduct - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getProductSubGroup(subGroupId) {
    try {
        const dbQueryParams = [{ param: 'subGroupId', value: subGroupId }];
        const subGroup = await dbDriver.executeQuery(
            dbQueries.selectSubGroupDetailsById,
            dbQueryParams
        );

        if (subGroup === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subGroup === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subGroup: subGroup.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getProductSubGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getProductGroup(groupId) {
    try {
        const dbQueryParams = [{ param: 'groupId', value: groupId }];
        const group = await dbDriver.executeQuery(dbQueries.selectGroupDetailsById, dbQueryParams);

        if (group === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (group === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            group: group.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getProductGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getProductSubscriptionPeriod(subPeriodId) {
    try {
        const dbQueryParams = [{ param: 'subPeriodId', value: subPeriodId }];
        const subPeriod = await dbDriver.executeQuery(
            dbQueries.selectSubscriptionPeriodDetailsById,
            dbQueryParams
        );

        if (subPeriod === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subPeriod === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            subscriptionPeriod: subPeriod.recordset,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getProductSubscriptionPeriod - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getOtherProductData(productId) {
    try {
        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);
        const subGroups = await dbDriver.executeQuery(dbQueries.selectSubGroups, []);
        const periods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);
        let product = undefined;

        if (productId) {
            const dbQueryParams = [{ param: 'productId', value: productId }];
            product = await dbDriver.executeQuery(
                dbQueries.selectProductDetailsById,
                dbQueryParams
            );
        }

        if (groups === -1 || subGroups === -1 || periods === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (groups === undefined || subGroups === undefined || periods === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            otherData: {
                groups: groups.recordset,
                subGroups: subGroups.recordset,
                periods: periods.recordset,
            },
            product: product ? product.recordset : product,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getOtherProductData - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function getOtherProductSubGroupData(subGroupId) {
    try {
        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);
        let subGroup = undefined;

        if (subGroupId) {
            const dbQueryParams = [{ param: 'subGroupId', value: subGroupId }];
            subGroup = await dbDriver.executeQuery(
                dbQueries.selectSubGroupDetailsById,
                dbQueryParams
            );
        }

        if (groups === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (groups === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        return {
            code: responseCodes.success,
            otherData: {
                groups: groups.recordset,
            },
            subGroup: subGroup ? subGroup.recordset : subGroup,
        };
    } catch (error) {
        logger.error(`Product Subscription Repo - getOtherProductSubGroupData - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function addProduct(productData) {
    try {
        if (productData == null || Object.keys(productData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Product details required.',
            };
        }

        const fees = [];

        if (productData.fees && Object.keys(productData.fees).length > 0) {
            const objKeys = Object.keys(productData.fees);

            for (let index = 0; index < objKeys.length; index++) {
                const periodId = objKeys[index].split('-')[0];
                const feeValue = productData.fees[objKeys[index]].fee;

                const params = {
                    period: periodId,
                    fee: Number(feeValue),
                };

                fees.push(params);
            }
        }

        const params = [
            { param: 'descriptionEn', value: productData.productEn },
            { param: 'descriptionAr', value: productData.productAr },
            { param: 'status', value: productData.status || 0 },
            { param: 'group', value: productData.group },
            { param: 'subGroup', value: productData.subGroup },
            { param: 'fees', value: JSON.stringify(fees) },
            // { param: 'vat', value: productData.vat ? parseFloat(productData.vat) / 100 : 0.0 },
            { param: 'isSuccess', value: 0 },
        ];

        const product = await dbDriver.executeProcedure(storedProcedures.addProduct, params);
        const { returnValue } = product;

        if (product === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (product === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        if (returnValue !== 1) {
            return {
                code: responseCodes.actionFailed,
                message: 'Something unexpected has occured. The transaction is rolled back.',
            };
        }

        const products = await dbDriver.executeQuery(dbQueries.selectProductDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Inserted Successfully',
        };

        if (products !== -1 && products !== undefined) {
            response.products = products.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - addProduct - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function addProductSubGroup(subGroupData) {
    try {
        if (subGroupData == null || Object.keys(subGroupData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Sub group details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: subGroupData.subGroupEn },
            { param: 'descriptionAr', value: subGroupData.subGroupAr },
            { param: 'group', value: subGroupData.group },
        ];

        const subGroup = await dbDriver.executeQuery(dbQueries.addProductSubGroup, params);

        if (subGroup === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subGroup === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subGroups = await dbDriver.executeQuery(dbQueries.selectProductSubGroupDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Sub Group Inserted Successfully',
        };

        if (subGroups !== -1 && subGroups !== undefined) {
            response.subGroups = subGroups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - addProductSubGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function addProductGroup(groupData) {
    try {
        if (groupData == null || Object.keys(groupData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Group details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: groupData.groupEn },
            { param: 'descriptionAr', value: groupData.groupAr },
        ];

        const group = await dbDriver.executeQuery(dbQueries.addProductGroup, params);

        if (group === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (group === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Group Inserted Successfully',
        };

        if (groups !== -1 && groups !== undefined) {
            response.groups = groups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - addProductGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function addProductSubscriptionPeriod(subscriptionPeriodData) {
    try {
        if (subscriptionPeriodData == null || Object.keys(subscriptionPeriodData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Subscription period details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: subscriptionPeriodData.periodEn },
            { param: 'descriptionAr', value: subscriptionPeriodData.periodAr },
        ];

        const subPeriod = await dbDriver.executeQuery(dbQueries.addSubscriptionPeriod, params);

        if (subPeriod === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subPeriod === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subPeriods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);

        const response = {
            code: responseCodes.success,
            message: 'Subscription Period Inserted Successfully',
        };

        if (subPeriods !== -1 && subPeriods !== undefined) {
            response.subscriptionPeriods = subPeriods.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - addProductSubscriptionPeriod - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function editProduct(productData) {
    try {
        if (productData == null || Object.keys(productData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Product details required.',
            };
        }

        const fees = [];

        if (productData.fees && Object.keys(productData.fees).length > 0) {
            const objKeys = Object.keys(productData.fees);

            for (let index = 0; index < objKeys.length; index++) {
                const periodId = objKeys[index].split('-')[0];
                const feeValue = productData.fees[objKeys[index]].fee;
                const feeId = productData.fees[objKeys[index]].feeId;

                const params = {
                    product: productData.productId,
                    period: periodId,
                    fee: Number(feeValue),
                    feeId: feeId,
                };

                fees.push(params);
            }
        }

        const params = [
            { param: 'descriptionEn', value: productData.productEn },
            { param: 'descriptionAr', value: productData.productAr },
            { param: 'status', value: productData.status || 0 },
            { param: 'group', value: productData.group },
            { param: 'subGroup', value: productData.subGroup },
            { param: 'productId', value: productData.productId },
            { param: 'fees', value: JSON.stringify(fees) },
            // { param: 'vat', value: productData.vat ? parseFloat(productData.vat) / 100 : 0.0 },
            { param: 'isSuccess', value: 0 },
        ];

        const product = await dbDriver.executeProcedure(storedProcedures.editProduct, params);
        const { returnValue } = product;

        if (product === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (product === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        if (returnValue !== 1) {
            return {
                code: responseCodes.actionFailed,
                message: 'Something unexpected has occured. The transaction is rolled back.',
            };
        }

        const products = await dbDriver.executeQuery(dbQueries.selectProductDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Updated Successfully',
        };

        if (products !== -1 && products !== undefined) {
            response.products = products.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - Edit Product - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function editProductSubGroup(subGroupData) {
    try {
        if (subGroupData == null || Object.keys(subGroupData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Sub group details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: subGroupData.subGroupEn },
            { param: 'descriptionAr', value: subGroupData.subGroupAr },
            { param: 'group', value: subGroupData.group },
            { param: 'subGroupId', value: subGroupData.subGroupId },
        ];

        const subGroup = await dbDriver.executeQuery(dbQueries.editProductSubGroup, params);

        if (subGroup === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subGroup === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subGroups = await dbDriver.executeQuery(dbQueries.selectProductSubGroupDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Sub Group Updated Successfully',
        };

        if (subGroups !== -1 && subGroups !== undefined) {
            response.subGroups = subGroups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - editProductSubGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function editProductGroup(groupData) {
    try {
        if (groupData == null || Object.keys(groupData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Group details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: groupData.groupEn },
            { param: 'descriptionAr', value: groupData.groupAr },
            { param: 'groupId', value: groupData.groupId },
        ];

        const group = await dbDriver.executeQuery(dbQueries.editProductGroup, params);

        if (group === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (group === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Group Updated Successfully',
        };

        if (groups !== -1 && groups !== undefined) {
            response.groups = groups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - editProductGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function editProductSubscriptionPeriod(subscriptionPeriodData) {
    try {
        if (subscriptionPeriodData == null || Object.keys(subscriptionPeriodData).length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Subscription period details required.',
            };
        }

        const params = [
            { param: 'descriptionEn', value: subscriptionPeriodData.periodEn },
            { param: 'descriptionAr', value: subscriptionPeriodData.periodAr },
            { param: 'subPeriodId', value: subscriptionPeriodData.subPeriodId },
        ];

        const subPeriod = await dbDriver.executeQuery(dbQueries.editSubscriptionPeriod, params);

        if (subPeriod === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subPeriod === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subPeriods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);

        const response = {
            code: responseCodes.success,
            message: 'Subscription Period Updated Successfully',
        };

        if (subPeriods !== -1 && subPeriods !== undefined) {
            response.subscriptionPeriods = subPeriods.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - editProductSubscriptionPeriod - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function deleteProduct(productId) {
    try {
        if (productId == null || productId.length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Product Id is required.',
            };
        }

        const dbQueryParams = [
            { param: 'productId', value: productId },
            { param: 'isSuccess', value: 0 },
        ];

        const product = await dbDriver.executeProcedure(
            storedProcedures.deleteProduct,
            dbQueryParams
        );
        const { returnValue } = product;

        if (product === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (product === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        if (returnValue !== 1) {
            return {
                code: responseCodes.actionFailed,
                message: 'Something unexpected has occured. The transaction is rolled back.',
            };
        }

        const products = await dbDriver.executeQuery(dbQueries.selectProductDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Deleted Successfully',
        };

        if (products !== -1 && products !== undefined) {
            response.products = products.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - deleteProduct - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function deleteProductSubGroup(subGroupId) {
    try {
        if (subGroupId == null || subGroupId.length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Sub Group Id is required.',
            };
        }

        const dbQueryParams = [{ param: 'subGroupId', value: subGroupId }];

        const subGroup = await dbDriver.executeQuery(
            dbQueries.deleteProductSubGroup,
            dbQueryParams
        );

        if (subGroup === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subGroup === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subGroups = await dbDriver.executeQuery(dbQueries.selectProductSubGroupDetails, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Sub Group Deleted Successfully',
        };

        if (subGroups !== -1 && subGroups !== undefined) {
            response.subGroups = subGroups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - deleteProductSubGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function deleteProductGroup(groupId) {
    try {
        if (groupId == null || groupId.length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Group Id is required.',
            };
        }

        const dbQueryParams = [{ param: 'groupId', value: groupId }];

        const group = await dbDriver.executeQuery(dbQueries.deleteProductGroup, dbQueryParams);

        if (group === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (group === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const groups = await dbDriver.executeQuery(dbQueries.selectGroups, []);

        const response = {
            code: responseCodes.success,
            message: 'Product Group Deleted Successfully',
        };

        if (groups !== -1 && groups !== undefined) {
            response.groups = groups.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - deleteProductGroup - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

async function deleteProductSubscriptionPeriod(subPeriodId) {
    try {
        if (subPeriodId == null || subPeriodId.length === 0) {
            return {
                code: responseCodes.validationError,
                message: 'Period Id is required.',
            };
        }

        const dbQueryParams = [{ param: 'subPeriodId', value: subPeriodId }];

        const subPeriod = await dbDriver.executeQuery(
            dbQueries.deleteSubscriptionPeriod,
            dbQueryParams
        );

        if (subPeriod === -1) {
            return { code: responseCodes.exception, message: 'DB connection error' };
        }

        if (subPeriod === undefined) {
            return { code: responseCodes.actionFailed, message: 'Data Loading Error' };
        }

        const subPeriods = await dbDriver.executeQuery(dbQueries.selectPeriods, []);

        const response = {
            code: responseCodes.success,
            message: 'Subscription Period Deleted Successfully',
        };

        if (subPeriods !== -1 && subPeriods !== undefined) {
            response.subscriptionPeriods = subPeriods.recordset;
        }

        return response;
    } catch (error) {
        logger.error(`Product Subscription Repo - deleteProductSubscriptionPeriod - ${error}`);
        return {
            code: responseCodes.exception,
            message: 'Something unexpected has occured. Please try again later.',
        };
    }
}

module.exports = {
    productDetails: productDetails,
    productSubscription: productSubscription,
    productSubscriptionTest: productSubscriptionTest,
    getAllProducts: getAllProducts,
    getProduct: getProduct,
    getOtherProductData: getOtherProductData,
    addProduct: addProduct,
    editProduct: editProduct,
    deleteProduct: deleteProduct,
    getAllProductSubGroups: getAllProductSubGroups,
    getProductSubGroup: getProductSubGroup,
    getOtherProductSubGroupData: getOtherProductSubGroupData,
    addProductSubGroup: addProductSubGroup,
    editProductSubGroup: editProductSubGroup,
    deleteProductSubGroup: deleteProductSubGroup,
    getAllProductGroups: getAllProductGroups,
    addProductGroup: addProductGroup,
    getProductGroup: getProductGroup,
    editProductGroup: editProductGroup,
    deleteProductGroup: deleteProductGroup,
    getAllProductSubscriptions: getAllProductSubscriptions,
    getAllPurchaseTransactions: getAllPurchaseTransactions,
    getAllProductSubscriptionPeriods: getAllProductSubscriptionPeriods,
    getProductSubscriptionPeriod: getProductSubscriptionPeriod,
    addProductSubscriptionPeriod: addProductSubscriptionPeriod,
    editProductSubscriptionPeriod: editProductSubscriptionPeriod,
    deleteProductSubscriptionPeriod: deleteProductSubscriptionPeriod,
    getAllPurchaseTransactionsByFilter: getAllPurchaseTransactionsByFilter,
    getAllProductSubscriptionsByFilter: getAllProductSubscriptionsByFilter,
};
