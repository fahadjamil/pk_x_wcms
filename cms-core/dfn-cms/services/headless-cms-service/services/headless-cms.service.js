// FIXME :(done) Use a separate "service" class for each module under the "services" folder (Ex: menus.service.js, pages.service.js)
// FIXME :(done) Keep the headless-cms.service for integrating all the sub services if needed
// FIXME :(done) Register these services with a "cms" prefix. (Ex: name: 'cms.menus-service');
/* FIXME :(done) Create a Repository class under each "module" and call the relevant method of repo instance from the service class
                banners.service.js
                    addBanner => bannersRepo.addBanner()
                * Reason for this is to avoid tight coupling with the Moleculer service endpoints
*/
/* FIXME :(done) Kepp all the classes related to a particular module inside that module folder
            Ex: modules
                    banners
                        banners-repo.js
                        banner.js
*/

const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../constants/collections-list');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'headless-cms',

    actions: {
        async appServerGetCollectionData(ctx) {
            logger.info(
                `CMS app server get collection data called. DBName: ${
                    ctx.params.dbName
                }, Collection: ${ctx.params.collectionName}, Query: ${JSON.stringify(
                    ctx.params.query
                )}, Sorter: ${ctx.params.sorter}, Limit: ${ctx.params.limit}`
            );
            const data = await this.appServerGetCollectionData(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.query,
                ctx.params.sorter,
                ctx.params.limit
            );

            return JSON.stringify(data);
        },

        async appServerGetSingleDocument(ctx) {
            logger.info(
                `CMS app server get single document called. DBName: ${
                    ctx.params.dbName
                }, Collection: ${ctx.params.collectionName}, Query: ${JSON.stringify(
                    ctx.params.query
                )}`
            );
            const data = await this.appServerGetSingleDocument(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.query
            );

            return JSON.stringify(data);
        },

        async appServerGetSingleDocumentById(ctx) {
            logger.info(
                `CMS app server get single document by id called. DBName: ${
                    ctx.params.dbName
                }, Collection: ${ctx.params.collectionName}, Query: ${JSON.stringify(
                    ctx.params.query
                )}`
            );
            const data = await this.appServerGetSingleDocumentById(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.query
            );

            return JSON.stringify(data);
        },

        async appServerInsertRecord(ctx) {
            logger.info(
                `CMS appServerInsertRecord called. DBName: ${ctx.params.dbName}, Collection: ${
                    ctx.params.collectionName
                }, Data: ${JSON.stringify(ctx.params.data)}`
            );
            const data = await this.appServerInsertRecord(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.data
            );

            return JSON.stringify(data);
        },

        async appServerGetImage(ctx) {
            logger.info(
                `CMS app server get image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.appServerGetImage(ctx.params.dbName, ctx.params.fileName);

            return data;
        },

        async appServerGetDocument(ctx) {
            logger.info(
                `CMS app server get document called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.appServerGetDocument(ctx.params.dbName, ctx.params.fileName);

            return data;
        },

        async getExistingIcon(ctx) {
            logger.info(
                `CMS get existing icon called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.getExistingIcon(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async deleteExistingIcon(ctx) {
            logger.info(
                `CMS delete existing icon called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.deleteExistingIcon(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async deleteExistingImage(ctx) {
            logger.info(
                `CMS delete existing image called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.deleteExistingImage(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async deleteExistingVideo(ctx) {
            logger.info(
                `CMS delete existing video called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.deleteExistingVideo(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async getExistingMedia(ctx) {
            logger.info(
                `CMS get existing media called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.getExistingMedia(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async deleteExistingMediaFiles(ctx) {
            logger.info(
                `CMS delete existing media files called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.deleteExistingMediaFiles(
                ctx.params.dbName,
                ctx.params.fileName
            );

            return JSON.stringify(data);
        },

        async deleteExistingMediaChunks(ctx) {
            logger.info(
                `CMS delete existing media chunks called. DBName: ${ctx.params.dbName}, ID: ${ctx.params.id}`
            );
            const data = await this.deleteExistingMediaChunks(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },
    },

    methods: {
        async appServerGetCollectionData(dbName, collectionName, query, sorter, limit) {
            const data = await dbDriver
                .findAll(query, sorter, collectionName, dbName, parseInt(limit))
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
            return data;
        },

        async appServerGetSingleDocument(dbName, collectionName, query) {
            const data = await dbDriver.FindOne(query, collectionName, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
            return data;
        },

        async appServerGetSingleDocumentById(dbName, collectionName, query) {
            const filter = { _id: ObjectID(query) };
            const data = await dbDriver.FindOne(filter, collectionName, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
            return data;
        },

        async appServerInsertRecord(dbName, collectionName, record) {
            const data = await dbDriver.insertOne(record, collectionName, dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            if (data) {
                const { result } = data;

                if (result.n == 1 && result.ok == 1) {
                    return {
                        status: 'success',
                        msg: 'Record inserted successfully',
                        data: data,
                    };
                }
            }

            return {
                status: 'failed',
                msg: 'Failed to insert the record',
                data: data,
            };
        },

        async appServerGetImage(dbName, fileName) {
            const data = await dbDriver.getImageForDisplay(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
            return data;
        },

        async appServerGetDocument(dbName, fileName) {
            const data = await dbDriver.getDocumentForDisplay(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
            return data;
        },

        async getExistingIcon(dbName, fileName) {
            const query = { fileName: fileName };
            const data = await dbDriver.FindOne(query, 'media-icons', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },

        async deleteExistingIcon(dbName, fileName) {
            const query = { fileName: fileName };
            const data = await dbDriver.remove(query, 'media-icons', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },

        async deleteExistingImage(dbName, fileName) {
            const query = { fileName: fileName };
            const data = await dbDriver.remove(query, 'media-images', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },

        async deleteExistingVideo(dbName, fileName) {
            const query = { fileName: fileName };
            const data = await dbDriver.remove(query, 'media-videos', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },

        async getExistingMedia(dbName, fileName) {
            const query = { filename: fileName };
            const data = await dbDriver.FindOne(query, 'media.files', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },

        async deleteExistingMediaFiles(dbName, fileName) {
            try {
                const query = { filename: fileName };
                const mediaFilesData = await dbDriver
                    .FindOne(query, 'media.files', dbName)
                    .catch((error) => {
                        return errorHandlerService.errorHandler(error);
                    });
                const data = await dbDriver.deleteGridfsImage(dbName, mediaFilesData._id);
                return data;
            } catch (error) {
                return errorHandlerService.errorHandler(error);
            }
        },

        async deleteExistingMediaChunks(dbName, id) {
            const query = { files_id: ObjectID(id) };
            const data = await dbDriver.remove(query, 'media.chunks', dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });

            return data;
        },
    },

    async started() {
        logger.info(`SERVICE - ${this.name} - Started.`);
    },

    async stopped() {
        logger.info(`SERVICE - ${this.name} - Stopped.`);
    },
};
