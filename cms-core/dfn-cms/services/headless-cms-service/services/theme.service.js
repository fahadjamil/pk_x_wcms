const themesRepo = require('../modules/themes/themes-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.theme',

    actions: {
        async getAllThemes(ctx) {
            logger.info(`CMS get all themes called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllThemes(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async updateThemeData(ctx) {
            logger.info(`CMS update theme data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.pageId}`);
            const data = await this.updateThemeData(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.updatedData
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllThemes(dbName) {
            return await themesRepo.getAllThemes(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateThemeData(dbName, pageId, updatedData) {
            return await themesRepo.updateThemeData(dbName, pageId, updatedData).catch((error) => {
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
