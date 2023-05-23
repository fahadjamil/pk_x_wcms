const authRepo = require('../modules/auth/auth-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'auth-service',

    actions: {
       
        async login(ctx) {
            logger.info(`Login called from web router. user: ${ctx.params.username}`);
            const data = await this.login(ctx.params.username, ctx.params.password);
            return JSON.stringify(data);
        },
        async adLogin(ctx) {
            logger.info(`Ad Login called from web router.`);
            const data = await this.adLogin();
            return JSON.stringify(data);
        },
        async adRedirect(ctx) {
            logger.info(
                `Ad Redirect called from web router. user: ${ctx.params.encryptedUsername}`
            );
            const data = await this.adRedirect(
                ctx.params.sessionId,
                ctx.params.encryptedUsername,
                ctx.params.errorCode
            );
            return JSON.stringify(data);
        },

        //TODO : Need to refresh admin redis cache
        async refreshAdErrorMapping(ctx) {
            this.startServer();
        },
    },

    methods: {
        startServer() {
            authRepo.startServer();
        },

      

        async login(username, password) {
            return await authRepo.login(username, password).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async adLogin() {
            return await authRepo.adLogin().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
        async adRedirect(sessionId, encryptedUsername, errorCode) {
            return await authRepo
                .adRedirect(sessionId, encryptedUsername, errorCode)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },
    },

    async started() {
        this.startServer();
        logger.info(`SERVICE - ${this.name} - Started`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped`);
    },
};
