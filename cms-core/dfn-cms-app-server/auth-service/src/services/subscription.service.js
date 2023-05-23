const subscriptionRepo = require('../modules/subscription/subscription-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;
const { ServiceBroker } = require('moleculer');
const HTTPClientService = require('moleculer-http-client');
const httpBroker = new ServiceBroker();
httpBroker.createService({
    name: 'http',

    // Load HTTP Client Service
    mixins: [HTTPClientService],
});

module.exports = {
    name: 'app-server.subscription',

    actions: {
        async productDetails(ctx) {
            logger.info(`Web subscription product details called. LoginId: ${ctx.params.loginId}`);
            const data = await this.productDetails(ctx.params.loginId);

            return JSON.stringify(data);
        },

        async productSubscription(ctx) {
            logger.info(
                `Web subscription product subscripton called. LoginId: ${ctx.params.loginId}`
            );
            const data = await this.productSubscription(
                ctx.params.loginId,
                ctx.params.paybleAmount,
                ctx.params.subscriptions,
                ctx.params.lang
            );

            return JSON.stringify(data);
        },

        async getAllProducts(ctx) {
            logger.info(`Web subscription get all products called.`);
            const data = await this.getAllProducts();

            return JSON.stringify(data);
        },

        async getAllProductSubGroups(ctx) {
            logger.info(`Web subscription get all product sub groups called.`);
            const data = await this.getAllProductSubGroups();

            return JSON.stringify(data);
        },

        async getAllProductGroups(ctx) {
            logger.info(`Web subscription get all product groups called.`);
            const data = await this.getAllProductGroups();

            return JSON.stringify(data);
        },

        async getAllProductSubscriptionPeriods(ctx) {
            logger.info(`Web subscription getAllProductSubscriptionPeriods called.`);
            const data = await this.getAllProductSubscriptionPeriods();

            return JSON.stringify(data);
        },

        async getAllProductSubscriptions(ctx) {
            logger.info(`Web subscription get all Product Subscriptions called.`);
            const data = await this.getAllProductSubscriptions();

            return JSON.stringify(data);
        },

        async getAllPurchaseTransactions(ctx) {
            logger.info(`Web subscription get all PurchaseTransactions called.`);
            const data = await this.getAllPurchaseTransactions();

            return JSON.stringify(data);
        },

        async getAllPurchaseTransactionsByFilter(ctx) {
            logger.info(
                `Web subscription getAllPurchaseTransactionsByFilter called. Filter : ${ctx.params.filter}`
            );
            const data = await this.getAllPurchaseTransactionsByFilter(ctx.params.filter);

            return JSON.stringify(data);
        },

        async getAllProductSubscriptionsByFilter(ctx) {
            logger.info(
                `Web subscription getAllProductSubscriptionsByFilter called. Filter : ${ctx.params.filter}`
            );
            const data = await this.getAllProductSubscriptionsByFilter(ctx.params.filter);

            return JSON.stringify(data);
        },

        async getProduct(ctx) {
            logger.info(`Web subscription get product called. Product Id: ${ctx.params.productId}`);
            const data = await this.getProduct(ctx.params.productId);

            return JSON.stringify(data);
        },

        async getProductSubGroup(ctx) {
            logger.info(
                `Web subscription get product sub group called. Sub group Id: ${ctx.params.subGroupId}`
            );
            const data = await this.getProductSubGroup(ctx.params.subGroupId);

            return JSON.stringify(data);
        },

        async getProductGroup(ctx) {
            logger.info(
                `Web subscription get product group called. Sub group Id: ${ctx.params.groupId}`
            );
            const data = await this.getProductGroup(ctx.params.groupId);

            return JSON.stringify(data);
        },

        async getProductSubscriptionPeriod(ctx) {
            logger.info(
                `Web subscription getProductSubscriptionPeriod called. subPeriodId: ${ctx.params.subPeriodId}`
            );
            const data = await this.getProductSubscriptionPeriod(ctx.params.subPeriodId);

            return JSON.stringify(data);
        },

        async getOtherProductData(ctx) {
            logger.info(
                `Web subscription getOtherProductData called. Product Id: ${ctx.params.productId}`
            );
            const data = await this.getOtherProductData(ctx.params.productId);

            return JSON.stringify(data);
        },

        async getOtherProductSubGroupData(ctx) {
            logger.info(
                `Web subscription getOtherProductSubGroupData called. subGroup Id: ${ctx.params.subGroupId}`
            );
            const data = await this.getOtherProductSubGroupData(ctx.params.subGroupId);

            return JSON.stringify(data);
        },

        async addProduct(ctx) {
            logger.info(
                `Web subscription addProduct called. productData: ${ctx.params.productData}`
            );
            const data = await this.addProduct(ctx.params.productData);

            return JSON.stringify(data);
        },

        async addProductSubGroup(ctx) {
            logger.info(
                `Web subscription addProductSubGroup called. subGroupData: ${ctx.params.subGroupData}`
            );
            const data = await this.addProductSubGroup(ctx.params.subGroupData);

            return JSON.stringify(data);
        },

        async addProductGroup(ctx) {
            logger.info(
                `Web subscription addProduct Group called. subGroupData: ${ctx.params.groupData}`
            );
            const data = await this.addProductGroup(ctx.params.groupData);

            return JSON.stringify(data);
        },

        async addProductSubscriptionPeriod(ctx) {
            logger.info(
                `Web subscription addProductSubscriptionPeriod called. subscriptionPeriodData: ${ctx.params.subscriptionPeriodData}`
            );
            const data = await this.addProductSubscriptionPeriod(ctx.params.subscriptionPeriodData);

            return JSON.stringify(data);
        },

        async editProduct(ctx) {
            logger.info(
                `Web subscription editProduct called. productData: ${ctx.params.productData}`
            );
            const data = await this.editProduct(ctx.params.productData);

            return JSON.stringify(data);
        },

        async editProductSubGroup(ctx) {
            logger.info(
                `Web subscription editProductSubGroup called. subGroupData: ${ctx.params.subGroupData}`
            );
            const data = await this.editProductSubGroup(ctx.params.subGroupData);

            return JSON.stringify(data);
        },

        async editProductGroup(ctx) {
            logger.info(
                `Web subscription editProduct Group called. GroupData: ${ctx.params.groupData}`
            );
            const data = await this.editProductGroup(ctx.params.groupData);

            return JSON.stringify(data);
        },

        async editProductSubscriptionPeriod(ctx) {
            logger.info(
                `Web subscription editProductSubscriptionPeriod called. subscriptionPeriodData: ${ctx.params.subscriptionPeriodData}`
            );
            const data = await this.editProductSubscriptionPeriod(
                ctx.params.subscriptionPeriodData
            );

            return JSON.stringify(data);
        },

        async deleteProduct(ctx) {
            logger.info(
                `Web subscription deleteProduct called. Product Id: ${ctx.params.productId}`
            );
            const data = await this.deleteProduct(ctx.params.productId);

            return JSON.stringify(data);
        },

        async deleteProductSubGroup(ctx) {
            logger.info(
                `Web subscription deleteProductSubGroup called. subGroup Id: ${ctx.params.subGroupId}`
            );
            const data = await this.deleteProductSubGroup(ctx.params.subGroupId);

            return JSON.stringify(data);
        },

        async deleteProductGroup(ctx) {
            logger.info(
                `Web subscription deleteProduct Group called. Group Id: ${ctx.params.groupId}`
            );
            const data = await this.deleteProductGroup(ctx.params.groupId);

            return JSON.stringify(data);
        },

        async deleteProductSubscriptionPeriod(ctx) {
            logger.info(
                `Web subscription deleteProductSubscriptionPeriod called. subPeriodId: ${ctx.params.subPeriodId}`
            );
            const data = await this.deleteProductSubscriptionPeriod(ctx.params.subPeriodId);

            return JSON.stringify(data);
        },
    },

    methods: {
        async productDetails(loginId) {
            return await subscriptionRepo.productDetails(loginId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async productSubscription(loginId, paybleAmount, subscriptions, lang) {
            let data = await subscriptionRepo
                .productSubscription(loginId, paybleAmount, subscriptions, httpBroker, lang)
                .catch((error) => {
                    console.log('error received ', error);
                    return errorHandlerService.errorHandler(error);
                });

            return data;
        },

        async getAllProducts() {
            return await subscriptionRepo.getAllProducts().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllProductSubGroups() {
            return await subscriptionRepo.getAllProductSubGroups().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllProductGroups() {
            return await subscriptionRepo.getAllProductGroups().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllProductSubscriptionPeriods() {
            return await subscriptionRepo.getAllProductSubscriptionPeriods().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllProductSubscriptions() {
            return await subscriptionRepo.getAllProductSubscriptions().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllPurchaseTransactions() {
            return await subscriptionRepo.getAllPurchaseTransactions().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllPurchaseTransactionsByFilter(filter) {
            return await subscriptionRepo
                .getAllPurchaseTransactionsByFilter(filter)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getAllProductSubscriptionsByFilter(filter) {
            return await subscriptionRepo
                .getAllProductSubscriptionsByFilter(filter)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getProduct(productId) {
            return await subscriptionRepo.getProduct(productId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getProductSubGroup(subGroupId) {
            return await subscriptionRepo.getProductSubGroup(subGroupId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getProductGroup(groupId) {
            return await subscriptionRepo.getProductGroup(groupId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getProductSubscriptionPeriod(subPeriodId) {
            return await subscriptionRepo
                .getProductSubscriptionPeriod(subPeriodId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getOtherProductData(productId) {
            return await subscriptionRepo.getOtherProductData(productId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getOtherProductSubGroupData(subGroupId) {
            return await subscriptionRepo.getOtherProductSubGroupData(subGroupId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addProduct(productData) {
            return await subscriptionRepo.addProduct(productData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addProductSubGroup(subGroupData) {
            return await subscriptionRepo.addProductSubGroup(subGroupData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addProductGroup(groupData) {
            return await subscriptionRepo.addProductGroup(groupData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addProductSubscriptionPeriod(subscriptionPeriodData) {
            return await subscriptionRepo
                .addProductSubscriptionPeriod(subscriptionPeriodData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async editProduct(productData) {
            return await subscriptionRepo.editProduct(productData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async editProductSubGroup(subGroupData) {
            return await subscriptionRepo.editProductSubGroup(subGroupData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async editProductGroup(groupData) {
            return await subscriptionRepo.editProductGroup(groupData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async editProductSubscriptionPeriod(subscriptionPeriodData) {
            return await subscriptionRepo
                .editProductSubscriptionPeriod(subscriptionPeriodData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async deleteProduct(productId) {
            return await subscriptionRepo.deleteProduct(productId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteProductSubGroup(subGroupId) {
            return await subscriptionRepo.deleteProductSubGroup(subGroupId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteProductGroup(groupId) {
            return await subscriptionRepo.deleteProductGroup(groupId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteProductSubscriptionPeriod(subPeriodId) {
            return await subscriptionRepo
                .deleteProductSubscriptionPeriod(subPeriodId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
        httpBroker.start();
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
        httpBroker.stop();
    },
};
