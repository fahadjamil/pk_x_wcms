const userManagementRepo = require('../modules/user-management/user-management-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'app-server.user-management',

    actions: {
        async userDetailsByEmail(ctx) {
            logger.info(
                `Web User Management - UserDetailsByEmail Called - Email: ${ctx.params.email}`
            );
            const data = await this.userDetailsByEmail(ctx.params.email);

            return JSON.stringify(data);
        },

        async userDetailsByName(ctx) {
            logger.info(
                `Web User Management - userDetailsByName Called - Name: ${ctx.params.name}`
            );
            const data = await this.userDetailsByName(ctx.params.name);

            return JSON.stringify(data);
        },

        async userDetailsByStatus(ctx) {
            logger.info(
                `Web User Management - userDetailsByStatus Called - Name: ${ctx.params.status}`
            );
            const data = await this.userDetailsByStatus(ctx.params.status);

            return JSON.stringify(data);
        },

        async userDetailsByRegDate(ctx) {
            logger.info(
                `Web User Management - UserDetailsByRegDate Called - from: ${ctx.params.fromDate}, to: ${ctx.params.toDate}`
            );
            const data = await this.userDetailsByRegDate(ctx.params.fromDate, ctx.params.toDate);

            return JSON.stringify(data);
        },

        async resendActivationLink(ctx) {
            logger.info(
                `Web User Management - ResendActivationLink Called - Email: ${ctx.params.email}, Lang: ${ctx.params.lang}`
            );
            const data = await this.resendActivationLink(ctx.params.email, ctx.params.lang);

            return JSON.stringify(data);
        },

        async activateUser(ctx) {
            logger.info(`Web User Management - ActivateUser Called - Email: ${ctx.params.email}`);
            const data = await this.activateUser(ctx.params.email);

            return JSON.stringify(data);
        },
    },

    methods: {
        async userDetailsByEmail(email) {
            return await userManagementRepo.userDetailsByEmail(email).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async userDetailsByName(name) {
            return await userManagementRepo.userDetailsByName(name).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async userDetailsByStatus(status) {
            return await userManagementRepo.userDetailsByStatus(status).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async userDetailsByRegDate(fromDate, toDate) {
            return await userManagementRepo.userDetailsByRegDate(fromDate, toDate).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async resendActivationLink(email, lang) {
            return await userManagementRepo.resendActivationLink(email, lang).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async activateUser(email) {
            return await userManagementRepo.activateUser(email).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
