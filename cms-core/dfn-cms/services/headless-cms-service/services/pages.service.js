const pagesRepo = require('../modules/pages/pages-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.pages',

    actions: {
        async getPage(ctx) {
            logger.info(`CMS get page called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`);
            const data = await this.getPage(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },

        async getAllPages(ctx) {
            logger.info(`CMS get all pages called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllPages(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async createPage(ctx) {
            logger.info(`CMS create page called. DBName: ${ctx.params.dbName}`);
            const data = await this.createPage(ctx.params.dbName, ctx.params.query);

            return JSON.stringify(data);
        },

        async deletePage(ctx) {
            logger.info(
                `CMS delete page called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.deletePage(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.pageData,
                ctx.params.workflowId,
                ctx.params.deletedBy
            );

            return JSON.stringify(data);
        },

        async updatePage(ctx) {
            logger.info(
                `CMS update page called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.updatePage(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.pageData,
                ctx.params.websiteId
            );

            return JSON.stringify(data);
        },

        async updateAllPages(ctx) {
            logger.info(`CMS update all pages called. DBName: ${ctx.params.dbName}`);
            const data = await this.updateAllPages(ctx.params.dbName, ctx.params.pages);

            return JSON.stringify(data);
        },

        async insertPageSection(ctx) {
            logger.info(
                `CMS insert page section called. DBName: ${ctx.params.dbName}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.insertPageSection(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.section
            );

            return JSON.stringify(data);
        },

        async updateLinkPage(ctx) {
            logger.info(`CMS update link page called. DBName: ${ctx.params.dbName}`);
            const data = await this.updateLinkPage(ctx.params.dbName, ctx.params.page);

            return JSON.stringify(data);
        },

        async getAllUnLinkPages(ctx) {
            logger.info(`CMS get all unlink pages called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllUnLinkPages(ctx.params.dbName, ctx.params.workflowState);

            return JSON.stringify(data);
        },

        async duplicatePage(ctx) {
            logger.info(
                `CMS duplicate page called. DBName: ${ctx.params.dbName}, page: ${ctx.params.pageTitle}, PageId: ${ctx.params.pageId}`
            );
            const data = await this.duplicatePage(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.pageTitle,
                ctx.params.masterTemplateId,
                ctx.params.workflow
            );

            return JSON.stringify(data);
        },

        async recordLock(ctx) {
            logger.info(
                `CMS page recordLock called. DBName: ${ctx.params.dbName}, pageId: ${ctx.params.pageId}, query: ${ctx.params.query}`
            );
            const data = await this.recordLock(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.query,
                ctx.params.activeUserId
            );

            return JSON.stringify(data);
        },

        async recordUnLock(ctx) {
            logger.info(
                `CMS page recordUnLock called. DBName: ${ctx.params.dbName}, pageId: ${ctx.params.pageId}, query: ${ctx.params.query}`
            );
            const data = await this.recordUnLock(
                ctx.params.dbName,
                ctx.params.pageId,
                ctx.params.query,
                ctx.params.activeUserId
            );

            return JSON.stringify(data);
        },

        async getPageLockingStatus(ctx) {
            logger.info(`CMS get PageLockingStatus called. DBName: ${ctx.params.dbName}, Id: ${ctx.params.id}`);
            const data = await this.getPageLockingStatus(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },
    },

    methods: {
        async getPage(dbName, id) {
            return await pagesRepo.getPage(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllPages(dbName) {
            return await pagesRepo.getAllPages(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async createPage(dbName, query) {
            return await pagesRepo.createPage(dbName, query).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async deletePage(dbName, pageId, pageData, workflowId, deletedBy) {
            return await pagesRepo
                .deletePage(dbName, pageId, pageData, workflowId, deletedBy)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updatePage(dbName, pageId, pageData, websiteId) {
            return await pagesRepo
                .updatePage(dbName, pageId, pageData, websiteId)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateAllPages(dbName, pages) {
            return await pagesRepo.updateAllPages(dbName, pages).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async insertPageSection(dbName, pageId, section) {
            return await pagesRepo.insertPageSection(dbName, pageId, section).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateLinkPage(dbName, page) {
            return await pagesRepo.updateLinkPage(dbName, page).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllUnLinkPages(dbName, workflowState) {
            return await pagesRepo.getAllUnLinkPages(dbName, workflowState).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async duplicatePage(dbName, pageId, pageTitle, masterTemplateId, workflow) {
            return await pagesRepo
                .duplicatePage(dbName, pageId, pageTitle, masterTemplateId, workflow)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async recordLock(dbName, pageId, query, activeUserId) {
            return await pagesRepo.recordLock(dbName, pageId, query, activeUserId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async recordUnLock(dbName, pageId, query, activeUserId) {
            return await pagesRepo.recordUnLock(dbName, pageId, query, activeUserId).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getPageLockingStatus(dbName, id) {
            return await pagesRepo.getPageLockingStatus(dbName, id).catch((error) => {
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
