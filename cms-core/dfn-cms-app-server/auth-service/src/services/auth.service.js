const authRepo = require('../modules/auth/auth-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'app-server.auth',

    actions: {
        async register(ctx) {
            logger.info(
                `Web Auth - Register Called - Name: ${ctx.params.name}, Email: ${ctx.params.email}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.register(
                ctx.params.name,
                ctx.params.email,
                ctx.params.password,
                ctx.params.password2,
                ctx.params.lang,
                ctx.params.prodId
            );

            return JSON.stringify(data);
        },

        async activateAccount(ctx) {
            logger.info(
                `Web Auth - ActivateAccount Called - Code: ${ctx.params.activationCode}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.activateAccount(ctx.params.activationCode, ctx.params.prodId);

            return JSON.stringify(data);
        },

        async login(ctx) {
            logger.info(
                `Web Auth - Login Called - Email: ${ctx.params.email}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.login(ctx.params.email, ctx.params.password, ctx.params.prodId);

            return JSON.stringify(data);
        },

        async logout(ctx) {
            logger.info(
                `Web Auth - Logout Called - Email: ${ctx.params.email}, ProdId: ${ctx.params.prodId}, SessionId: ${ctx.params.sessionId}`
            );
            const data = await this.logout(
                ctx.params.email,
                ctx.params.prodId,
                ctx.params.sessionId
            );

            return JSON.stringify(data);
        },

        async changePassword(ctx) {
            logger.info(
                `Web Auth - ChangePassword Called - Username(Email): ${ctx.params.userName}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.changePassword(
                ctx.params.userName,
                ctx.params.oldPassword,
                ctx.params.newPassword,
                ctx.params.newPassword2,
                ctx.params.prodId
            );

            return JSON.stringify(data);
        },

        async forgotPassword(ctx) {
            logger.info(
                `Web Auth - ForgotPassword Called - Email: ${ctx.params.email}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.forgotPassword(ctx.params.email, ctx.params.prodId);

            return JSON.stringify(data);
        },

        async otpValidation(ctx) {
            logger.info(
                `Web Auth - OTPValidation Called - Email: ${ctx.params.email}, OTP: ${ctx.params.otp}, ProdId: ${ctx.params.prodId}`
            );
            const data = await this.otpValidation(
                ctx.params.email,
                ctx.params.otp,
                ctx.params.newPassword,
                ctx.params.newPassword2,
                ctx.params.prodId
            );

            return JSON.stringify(data);
        },

        async contactUs(ctx) {
            logger.info(
                `Web Auth - ContactUs Called - Email: ${ctx.params.email}, Message: ${ctx.params.message}`
            );
            const data = await this.contactUs(ctx.params.email, ctx.params.message);

            return JSON.stringify(data);
        },

        async refreshSubscriptionMapping(ctx) {
            this.startServer();
        },
    },

    methods: {
        startServer() {
            authRepo.startServer();
        },

        async register(name, email, password, password2, lang, prodId) {
            return await authRepo
                .register(name, email, password, password2, lang, prodId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async activateAccount(activationCode, prodId) {
            return await authRepo.activateAccount(activationCode, prodId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async login(email, password, prodId) {
            return await authRepo.login(email, password, prodId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async logout(email, prodId, sessionId) {
            return await authRepo.logout(email, prodId, sessionId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async changePassword(userName, oldPassword, newPassword, newPassword2, prodId) {
            return await authRepo
                .changePassword(userName, oldPassword, newPassword, newPassword2, prodId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async forgotPassword(email, prodId) {
            return await authRepo.forgotPassword(email, prodId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async otpValidation(email, otp, newPassword, newPassword2, prodId) {
            return await authRepo
                .otpValidation(email, otp, newPassword, newPassword2, prodId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async contactUs(email, message) {
            return await authRepo.contactUs(email, message).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
        this.startServer();
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
