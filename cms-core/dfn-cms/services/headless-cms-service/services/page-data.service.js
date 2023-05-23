const { ReplaceImageFile } = require('../modules/page-data/page-data-repo');
const pageDataRepo = require('../modules/page-data/page-data-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.page-data',

    actions: {
        async getContentData(ctx) {
            logger.info(`CMS get content data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`);
            const data = await this.getContentData(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },

        async getAllContentData(ctx) {
            logger.info(`CMS get all content data called. DBName: ${ctx.params.dbName}, Id: ${JSON.stringify(ctx.params.idList)}`);
            const data = await this.getAllContentData(ctx.params.dbName, ctx.params.idList);

            return JSON.stringify(data);
        },

        async getAllPageData(ctx) {
            logger.info(`CMS get all page data called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllPageData(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getImage(ctx) {
            logger.info(`CMS get image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`);
            const data = await this.getImage(ctx.params.dbName, ctx.params.fileName);

            return data;
        },

        async insertPageData(ctx) {
            logger.info(`CMS insert page data called. DBName: ${ctx.params.dbName}`);
            const data = await this.insertPageData(ctx.params.dbName, ctx.params.query);

            return JSON.stringify(data);
        },

        async insertSectionData(ctx) {
            logger.info(`CMS insert section data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.pageId}`);
            const data = await this.insertSectionData(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.sectionData
            );

            return JSON.stringify(data);
        },

        async updateComponentData(ctx) {
            logger.info(`CMS update component data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.pageId}`);
            const data = await this.updateComponentData(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.updatedData
            );

            return JSON.stringify(data);
        },

        async updateAllPageComponentData(ctx) {
            logger.info(`CMS update all page component data called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.pageId}`);
            const data = await this.updateAllPageComponentData(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.updatedPageContent
            );

            return JSON.stringify(data);
        },

        async uploadImage(ctx) {
            logger.info(`CMS upload image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`);
            const data = await this.uploadImage(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async ReplaceImageFile(ctx) {
            logger.info(`CMS replace image file called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`);
            const data = await this.ReplaceImageFile(
                ctx.params.dbName,
                ctx.params.thumbnailUri,
                ctx.params.fileName
            );

            return JSON.stringify(data);
        },

        async ckEditorUploadImage(ctx) {
            logger.info(`CMS CK editor upload image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`);
            const data = await this.ckEditorUploadImage(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async getPublishablePageData(ctx) {
            logger.info(`CMS get publishable page data called. DBName: ${ctx.params.dbName}, Publish level: ${ctx.params.publishLevel}`);
            const data = await this.getPublishablePageData(ctx.params.dbName, ctx.params.publishLevel);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getContentData(dbName, id) {
            return await pageDataRepo.getContentData(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllContentData(dbName, idList) {
            return await pageDataRepo.getAllContentData(dbName, idList).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllPageData(dbName) {
            return await pageDataRepo.getAllPageData(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getImage(dbName, fileName) {
            return await pageDataRepo.getImage(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async insertPageData(dbName, query) {
            return await pageDataRepo.insertPageData(dbName, query).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async insertSectionData(dbName, pageId, sectionData) {
            return await pageDataRepo
                .insertSectionData(dbName, pageId, sectionData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateComponentData(dbName, pageId, updatedData) {
            return await pageDataRepo
                .updateComponentData(dbName, pageId, updatedData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateAllPageComponentData(dbName, pageId, updatedPageContent) {
            return await pageDataRepo
                .updateAllPageComponentData(dbName, pageId, updatedPageContent)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async uploadImage(dbName, fileName) {
            return await pageDataRepo.uploadImage(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async ReplaceImageFile(dbName, thumbnailUri, fileName) {
            return await pageDataRepo
                .ReplaceImageFile(dbName, thumbnailUri, fileName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async ckEditorUploadImage(dbName, fileName) {
            return await pageDataRepo.ckEditorUploadImage(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getPublishablePageData(dbName, publishLevel) {
            return await pageDataRepo.getPublishablePageData(dbName, publishLevel).catch((error) => {
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
