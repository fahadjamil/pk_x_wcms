const usersRepo = require('../modules/users/users-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.users',

    actions: {
        async getLoggedUser(ctx) {
            logger.info(`CMS get logged user called. User: ${ctx.params.user}`);
            const data = await this.getLoggedUser(ctx.params.user, ctx.params.password);

            return JSON.stringify(data);
        },

        async getAllUsers(ctx) {
            logger.info(`CMS get all users called.`);
            const data = await this.getAllUsers();

            return JSON.stringify(data);
        },

        async getAllUser(ctx) {
            logger.info(`CMS get all user called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllUser(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async updateUser(ctx) {
            logger.info(`CMS update user called. DBName: ${ctx.params.dbName} User: ${ctx.params.user}`);
            const data = await this.updateUser(ctx.params.dbName, ctx.params.user);

            return JSON.stringify(data);
        },

        async addUser(ctx) {
            logger.info(`CMS add user called. DBName: ${ctx.params.dbName} User: ${ctx.params.user}`);
            const data = await this.addUser(ctx.params.dbName, ctx.params.user);

            return JSON.stringify(data);
        },

        async removeUser(ctx) {
            logger.info(`CMS remove user called. DBName: ${ctx.params.dbName} User: ${ctx.params.user}`);
            const data = await this.removeUser(ctx.params.dbName, ctx.params.user);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getLoggedUser(user, password) {
            return await usersRepo.getLoggedUser(user, password).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllUsers() {
            return await usersRepo.getAllUsers().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllUser(dbName) {
            return await usersRepo.getAllUser(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateUser(dbName, user) {
            return await usersRepo.updateUser(dbName, user).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async addUser(dbName, user) {
            return await usersRepo.addUser(dbName, user).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async removeUser(dbName, user) {
            return await usersRepo.removeUser(dbName, user).catch((error) => {
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
