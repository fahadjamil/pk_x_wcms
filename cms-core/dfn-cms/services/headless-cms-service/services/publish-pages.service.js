const publishPagesRepo = require('../modules/publish-pages/publish-pages-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;
const { Console } = require('console');
const { PUBLISHER_NODE } = require('./../config/config');

module.exports = {
    name: 'cms.publish-pages',

    actions: {
        async postRelease(ctx) {
            logger.info(
                `CMS post release called. DBName: ${ctx.params.dbName}, Publish level: ${ctx.params.publishLevel}`
            );
            const data = await this.postRelease(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.publishLevel
            );

            return JSON.stringify(data);
        },

        async postReleaseProgress(ctx) {
            logger.info(`CMS post release progress called. DBName: ${ctx.params.dbName}`);
            const data = await this.postReleaseProgress(ctx.params.dbName, ctx.params.status);

            return JSON.stringify(data);
        },

        async getReleaseProgress(ctx) {
            logger.info(`CMS get release progress called. DBName: ${ctx.params.dbName}`);
            const data = await this.getReleaseProgress(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async setReleaseProgressToUnpblished(ctx) {
            logger.info(`CMS setReleaseProgressToUnpblished called. DBName: ${ctx.params.dbName}`);
            const data = await this.setReleaseProgressToUnpblished(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async getPublishablePages(ctx) {
            logger.info(`CMS get publishable pages called. DBName: ${ctx.params.dbName}`);
            const data = await this.getPublishablePages(ctx.params.dbName, ctx.params.publishLevel);

            return JSON.stringify(data);
        },

        async getReleases(ctx) {
            logger.info(`CMS get releases called. DBName: ${ctx.params.dbName}`);
            const data = await this.getReleases(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async refreshWebsiteCache(ctx) {
            logger.info(`Refresh website cache called. DBName: ${ctx.params.dbName}`);
            const data = await this.refreshWebsiteCache(ctx.params.dbName);

            return JSON.stringify(data);
        },
        async  refreshFilteredWebsiteCache(ctx) {
            logger.info(`Refresh website filtered cache called. DBName: ${ctx.params.dbName}`);
            const data = await this.refreshWebsiteCache(ctx.params.dbName, ctx.params.custTypeName);
            return JSON.stringify(data);
        },
    },

    methods: {
        async postRelease(dbName, queryValue, publishLevel) {
            try {
                const isReleaseInprogress = await this.broker.call(
                    'cms.site-publisher.isBuildInProgress'
                );

                if (!isReleaseInprogress) {
                    await this.postReleaseProgress(dbName, 'inprogress');

                    this.broker.call(
                        'cms.site-publisher.releaseBuild',
                        { dbName: dbName, publishLevel: publishLevel },
                        { nodeID: PUBLISHER_NODE }
                    );

                    await publishPagesRepo.postRelease(dbName, queryValue, publishLevel);
                    const results = {
                        status: 'success',
                        msg: 'Page Build Started',
                    };
                    return results;
                }

                const data = {
                    status: 'inprogress',
                    msg: 'An ongoing release process found.',
                };

                return data;
            } catch (e) {
                await this.postReleaseProgress(dbName, 'failed');

                errorHandlerService.errorHandler(e);
                console.error(e);

                const data = {
                    status: 'failed',
                    msg: 'Something unexpected has occured. Please try again later.',
                };

                return data;
            }
        },

        async postReleaseProgress(dbName, status) {
            return await publishPagesRepo.postReleaseProgress(dbName, status).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getReleaseProgress(dbName) {
            return await publishPagesRepo.getReleaseProgress(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async setReleaseProgressToUnpblished(dbName) {
            return await publishPagesRepo.setReleaseProgressToUnpblished(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getPublishablePages(dbName, publishLevel) {
            return await publishPagesRepo
                .getPublishablePages(dbName, publishLevel)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getReleases(dbName) {
            return await publishPagesRepo.getReleases(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async refreshWebsiteCache(dbName) {
            let data = '';
            try {
                this.broker
                    .call(
                        'cms.site-publisher.refreshWebsiteCache',
                        { dbName: dbName },
                        { nodeID: PUBLISHER_NODE }
                    )
                    .then((data) => {
                        data = 'success';
                    })
                    .catch((err) => {
                        data = 'failed';
                    });
            } catch (e) {
                errorHandlerService.errorHandler(e);
            }
        },

        async refreshFilteredWebsiteCache(dbName, custTypeName) {
            let data = '';
            try {
                this.broker
                    .call(
                        'cms.site-publisher.refreshFilteredWebsiteCache',
                        { dbName: dbName , custTypeName : custTypeName},
                        { nodeID: PUBLISHER_NODE }
                    )
                    .then((data) => {
                        data = 'success';
                    })
                    .catch((err) => {
                        data = 'failed';
                    });
            } catch (e) {
                errorHandlerService.errorHandler(e);
            }
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
