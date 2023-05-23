const bannerRepo = require('../modules/banners/banner-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.banner',

    actions: {
        async createBanner(ctx) {
            logger.info(`CMS create banner called. DBName: ${ctx.params.dbName}`);
            const data = await this.createBanner(ctx.params.dbName, ctx.params.bannerData);

            return JSON.stringify(data);
        },

        async getAllBanners(ctx) {
            logger.info(`CMS get all banners called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllBanners(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getBanner(ctx) {
            logger.info(
                `CMS get banner called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getBanner(ctx.params.id, ctx.params.dbName);

            return JSON.stringify(data);
        },

        async updateBanner(ctx) {
            logger.info(
                `CMS update banner called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.updateBanner(
                ctx.params.id,
                ctx.params.bannerData,
                ctx.params.dbName
            );

            return JSON.stringify(data);
        },

        async getApprovedBanner(ctx) {
            logger.info(
                `CMS get approved banner called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`
            );
            const data = await this.getApprovedBanner(ctx.params.id, ctx.params.dbName);

            return JSON.stringify(data);
        },

        async deleteBanner(ctx) {
            logger.info(
                `CMS delete banner called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id} , Id: ${ctx.params.workflowId} , Id: ${ctx.params.deletedBy}`
            );
            const data = await this.deleteBanner(
                ctx.params.dbName,
                ctx.params.id,
                ctx.params.workflowId,
                ctx.params.deletedBy
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async createBanner(dbName, bannerData) {
            return await bannerRepo.createBanner(dbName, bannerData).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllBanners(dbName) {
            return await bannerRepo.getAllBanners(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getBanner(id, dbName) {
            return await bannerRepo.getBanner(id, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateBanner(bannerId, bannerData, dbName) {
            return await bannerRepo.updateBanner(bannerId, bannerData, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getApprovedBanner(id, dbName) {
            return await bannerRepo.getApprovedBanner(id, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deleteBanner(dbName, id, workflowId, deletedBy) {
            return await bannerRepo
                .deleteBanner(dbName, id, workflowId, deletedBy)
                .catch((error) => {
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
