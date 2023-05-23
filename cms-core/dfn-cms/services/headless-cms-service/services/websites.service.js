const websiteRepo = require('../modules/websites/websites-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.websites',

    actions: {
       
        async getAllDataFromCollection(ctx) {
            logger.info(
                `CMS get all data from collection called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getAllDataFromCollection(
                ctx.params.dbName,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async getFileFromGridFs(ctx) {
            logger.info(
                `CMS get file from gridFs called. DBName: ${ctx.params.dbName}, collectionName: ${ctx.params.collectionName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.getFileFromGridFs(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.fileName
            );

            return data;
        },

        async getAllWebSites(ctx) {
            logger.info('CMS getAllWebSites called.');
            const data = await this.getAllWebSites();

            return JSON.stringify(data);
        },

        async createWebSite(ctx) {
            logger.info(
                `CMS create website called. DBName: ${ctx.params.dbName}, User: ${ctx.params.username}`
            );
            const data = await this.createWebSite(
                ctx.params.query,
                ctx.params.dbName,
                ctx.params.themes,
                ctx.params.workflows,
                ctx.params.mainMenu,
                ctx.params.footerMenu,
                ctx.params.roleCounter,
                ctx.params.username
            );

            return JSON.stringify(data);
        },

        async getWebSite(ctx) {
            logger.info(`CMS get website called. Id: ${ctx.params.id}`);
            const data = await this.getWebSite(ctx.params.id);

            return JSON.stringify(data);
        },

        async updateWebsiteLanguages(ctx) {
            logger.info(
                `CMS update website languages called. Id: ${
                    ctx.params.id
                }, Languages: ${JSON.stringify(ctx.params.languages)}`
            );
            const data = await this.updateWebsiteLanguages(ctx.params.id, ctx.params.languages);

            return JSON.stringify(data);
        },

        async updateWebsite(ctx) {
            logger.info(`CMS update website called. Id: ${ctx.params.id}`);
            const data = await this.updateWebsite(ctx.params.id, ctx.params.query);

            return JSON.stringify(data);
        },

        async getWebsiteLanguages(ctx) {
            logger.info(`CMS get website languages called. DBName: ${ctx.params.dbName}`);
            const data = await this.getWebsiteLanguages(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async AddStaticResource(ctx) {
            logger.info(
                `CMS Add Static Resource called. DBName: ${ctx.params.dbName}, File Type: ${ctx.params.fileType}, File Name: ${ctx.params.fileName}`
            );
            const data = await this.AddStaticResource(
                ctx.params.dbName,
                ctx.params.fileName,
                ctx.params.uniqFileName,
                ctx.params.fileSize,
                ctx.params.fileType
            );

            return JSON.stringify(data);
        },

        async updateStaticResourceLinks(ctx) {
            logger.info(`CMS updateStaticResourceLinks called. DBName: ${ctx.params.dbName}`);
            const data = await this.updateStaticResourceLinks(
                ctx.params.dbName,
                ctx.params.staticResourceLinks
            );

            return JSON.stringify(data);
        },

        async deleteStaticResource(ctx) {
            logger.info(
                `CMS deleteStaticResource called. Id: ${ctx.params.id}, dbName: ${JSON.stringify(
                    ctx.params.dbName
                )}, collectionName: ${JSON.stringify(ctx.params.collectionName)}`
            );
            const data = await this.deleteStaticResource(
                ctx.params.dbName,
                ctx.params.id,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async getAllDataFromCollection(dbName, collectionName) {
            return await websiteRepo
                .getAllDataFromCollection(dbName, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getFileFromGridFs(dbName, collectionName, fileName) {
            return await websiteRepo
                .getFileFromGridFs(dbName, collectionName, fileName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getAllWebSites() {
            return await websiteRepo.getAllWebSites().catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async createWebSite(
            query,
            dbName,
            themes,
            workflows,
            mainMenu,
            footerMenu,
            roleCounter,
            username
        ) {
            return await websiteRepo
                .createWebSite(
                    query,
                    dbName,
                    themes,
                    workflows,
                    mainMenu,
                    footerMenu,
                    roleCounter,
                    username
                )
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getWebSite(id) {
            return await websiteRepo.getWebSite(id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateWebsiteLanguages(id, languages) {
            return await websiteRepo.updateWebsiteLanguages(id, languages).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateWebsite(id, query) {
            return await websiteRepo.updateWebsite(id, query).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getWebsiteLanguages(dbName) {
            return await websiteRepo.getWebsiteLanguages(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async AddStaticResource(dbName, fileName, uniqFileName, fileSize, fileType) {
            return await websiteRepo
                .AddStaticResource(dbName, fileName, uniqFileName, fileSize, fileType)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateStaticResourceLinks(dbName, staticResourceLinks) {
            return await websiteRepo
                .updateStaticResourceLinks(dbName, staticResourceLinks)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async deleteStaticResource(dbName, id, collectionName) {
            return await websiteRepo
                .deleteStaticResource(dbName, id, collectionName)
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
