const menuRepo = require('../modules/menu/menu-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.menu',

    actions: {
        async getAllMenu(ctx) {
            logger.info(`CMS get all menu called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllMenu(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async insertMenuItem(ctx) {
            logger.info(`CMS insert menu item called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`);
            const data = await this.insertMenuItem(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.section
            );

            return JSON.stringify(data);
        },

        async deletePageFromMenu(ctx) {
            logger.info(`CMS delete page from menu called. DBName: ${ctx.params.dbName} , PageId: ${ctx.params.pageId}`);
            const data = await this.deletePageFromMenu(
                ctx.params.dbName,
                ctx.params.pageId
            );

            return JSON.stringify(data);
        },

        async saveAllMenu(ctx) {
            logger.info(`CMS save all menu called. DBName: ${ctx.params.dbName}`);
            const data = await this.saveAllMenu(ctx.params.dbName, ctx.params.menu);

            return JSON.stringify(data);
        },

        async saveMenu(ctx) {
            logger.info(`CMS save menu called. DBName: ${ctx.params.dbName}`);
            const data = await this.saveMenu(ctx.params.dbName, ctx.params.menu);

            return JSON.stringify(data);
        },

        async getMainMenuNamesForMappedPages(ctx) {
            logger.info(`CMS getMainMenuNamesForMappedPages called. DBName: ${ctx.params.dbName}`);
            const data = await this.getMainMenuNamesForMappedPages(ctx.params.dbName);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllMenu(dbName) {
            return await menuRepo.getAllMenu(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async insertMenuItem(dbName, pageId, section) {
            return await menuRepo.insertMenuItem(dbName, pageId, section).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deletePageFromMenu(dbName, pageId) {
            return await menuRepo.deletePageFromMenu(dbName, pageId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async saveAllMenu(dbName, menu) {
            return await menuRepo.saveAllMenu(dbName, menu).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async saveMenu(dbName, menu) {
            return await menuRepo.saveMenu(dbName, menu).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getMainMenuNamesForMappedPages(dbName) {
            return await menuRepo.getMainMenuNamesForMappedPages(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped`);
    },
};
