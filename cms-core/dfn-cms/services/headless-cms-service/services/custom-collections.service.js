const customCollectionsRepo = require('../modules/custom-collections/custom-collections-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.custom-collections',

    actions: {
        async createCustomCollection(ctx) {
            logger.info(
                `CMS create custom collection called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.createCustomCollection(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async insertNewCollection(ctx) {
            logger.info(
                `CMS insert new collection called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.insertNewCollection(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async insertDynamicFormData(ctx) {
            logger.info(
                `CMS insert dynamic form data called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.insertDynamicFormData(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async updateCollectionType(ctx) {
            logger.info(
                `CMS update collection type called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}, Page: ${ctx.params.pageId}`
            );
            const data = await this.updateCollectionType(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.pageId,
                ctx.params.updatedData
            );

            return JSON.stringify(data);
        },

        async getcustomCollectionTypes(ctx) {
            logger.info(
                `CMS get custom collection types called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getcustomCollectionTypes(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName,
                ctx.params.user,
                ctx.params.sorter
            );

            return JSON.stringify(data);
        },

        async updateCollectionDoc(ctx) {
            logger.info(
                `CMS update collection doc called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}, Page: ${ctx.params.pageId}`
            );
            const data = await this.updateCollectionDoc(
                ctx.params.dbName,
                ctx.params.collectionName,
                ctx.params.pageId,
                ctx.params.updatedData
            );

            return JSON.stringify(data);
        },

        async uploadDocument(ctx) {
            logger.info(
                `CMS upload document called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.uploadDocument(ctx.params.dbName, ctx.params.fileName);

            return JSON.stringify(data);
        },

        async getDocument(ctx) {
            logger.info(
                `CMS get document called. DBName: ${ctx.params.dbName}, FileName: ${ctx.params.fileName}`
            );
            const data = await this.getDocument(ctx.params.dbName, ctx.params.fileName);

            return data;
        },

        async getCollectionAll(ctx) {
            logger.info(
                `CMS get collection all called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getCollectionAll(ctx.params.dbName, ctx.params.collectionName);

            return JSON.stringify(data);
        },

        async getImagesByTitle(ctx) {
            logger.info(
                `CMS get images by title called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getImagesByTitle(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async getImagesByDesc(ctx) {
            logger.info(
                `CMS get images by desc called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getImagesByDesc(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async getIconsByFileName(ctx) {
            logger.info(
                `CMS get icons by file name called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getIconsByFileName(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async getVideosByTitle(ctx) {
            logger.info(
                `CMS get videos by title called. DBName: ${ctx.params.dbName}, Collection: ${ctx.params.collectionName}`
            );
            const data = await this.getVideosByTitle(
                ctx.params.dbName,
                ctx.params.query,
                ctx.params.collectionName
            );

            return JSON.stringify(data);
        },

        async getAllCustomCollection(ctx) {
            logger.info(`CMS get all custom collection called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllCustomCollection(ctx.params.dbName);

            return JSON.stringify(data);
        },

        async saveAllCustomCollection(ctx) {
            logger.info(`CMS save all custom collection called. DBName: ${ctx.params.dbName}`);
            const data = await this.saveAllCustomCollection(
                ctx.params.dbName,
                ctx.params.customCollections
            );

            return JSON.stringify(data);
        },

        async createCustomTree(ctx) {
            logger.info(
                `CMS create custom tree collection called. DBName: ${ctx.params.dbName}, title: ${ctx.params.title}`
            );
            const data = await this.createCustomTree(ctx.params.dbName, ctx.params.title);

            return JSON.stringify(data);
        },

        async getAllCustomTrees(ctx) {
            logger.info(`CMS get custom tree collection called. DBName: ${ctx.params.dbName}`);
            const data = await this.getAllCustomTrees(ctx.params.dbName, ctx.params.user);

            return JSON.stringify(data);
        },

        async getCustomTreeById(ctx) {
            logger.info(
                `CMS get custom tree by id called. DBName: ${ctx.params.dbName}, id: ${ctx.params.id}`
            );
            const data = await this.getCustomTreeById(ctx.params.dbName, ctx.params.id);

            return JSON.stringify(data);
        },

        async updateCustomTree(ctx) {
            logger.info(
                `CMS update custom tree called. DBName: ${ctx.params.dbName}, id: ${ctx.params.id}`
            );
            const data = await this.updateCustomTree(
                ctx.params.dbName,
                ctx.params.id,
                ctx.params.tree
            );

            return JSON.stringify(data);
        },

        async getcustomCollectionDocsByCollectionAndId(ctx) {
            logger.info(
                `CMS getcustomCollectionDocsByCollectionAndId called. DBName: ${ctx.params.dbName}, query: ${ctx.params.mappingQuery}`
            );
            const data = await this.getcustomCollectionDocsByCollectionAndId(
                ctx.params.dbName,
                ctx.params.mappingQuery
            );

            return JSON.stringify(data);
        },

        async getDocumentHistory(ctx) {
            logger.info(
                `CMS getDocumentHistory called. DBName: ${ctx.params.dbName}, id: ${ctx.params.id}, collection: ${ctx.params.collection}`
            );
            const data = await this.getDocumentHistory(
                ctx.params.dbName,
                ctx.params.id,
                ctx.params.collection,
                ctx.params.limit
            );

            return JSON.stringify(data);
        },

        async getLastUpdatedDocumentMetaInfo(ctx) {
            logger.info(
                `CMS getLastUpdatedDocumentMetaInfo called. DBName: ${ctx.params.dbName}, collection: ${ctx.params.collection}`
            );
            const data = await this.getLastUpdatedDocumentMetaInfo(
                ctx.params.dbName,
                ctx.params.collection
            );

            return JSON.stringify(data);
        },

        async getTreeCustomCollections(ctx) {
            logger.info(
                `CMS getTreeCustomCollections called. DBName: ${ctx.params.dbName}, treeId: ${ctx.params.treeId}, nodeId: ${ctx.params.nodeId}, nodePath: ${ctx.params.nodePath}`
            );
            const data = await this.getTreeCustomCollections(
                ctx.params.dbName,
                ctx.params.treeId,
                ctx.params.nodeId,
                ctx.params.nodePath
            );

            return JSON.stringify(data);
        },

        async searchTreeCustomCollections(ctx) {
            logger.info(
                `CMS searchTreeCustomCollections called. DBName: ${ctx.params.dbName}, treeId: ${ctx.params.treeId}, parentNodeIds: ${ctx.params.parentNodeIds}, keyWord: ${ctx.params.keyWord}, sorting: ${ctx.params.sorting}`
            );
            const data = await this.searchTreeCustomCollections(
                ctx.params.dbName,
                ctx.params.treeId,
                ctx.params.parentNodeIds,
                ctx.params.keyWord,
                ctx.params.sorting
            );

            return JSON.stringify(data);
        },

        async deleteTreeCustomCollections(ctx) {
            logger.info(
                `CMS deleteTreeCustomCollections called. DBName: ${ctx.params.dbName}, treeId: ${ctx.params.treeId}, deletedBy: ${ctx.params.deletedBy}`
            );
            const data = await this.deleteTreeCustomCollections(
                ctx.params.dbName,
                ctx.params.treeId,
                ctx.params.deletedBy,
            );

            return JSON.stringify(data);
        },

        async customCollectionRecordDelete(ctx) {
            logger.info(
                `CMS customCollectionRecordDelete called. DBName: ${ctx.params.dbName}, DocId: ${ctx.params.docId}, Collection: ${ctx.params.collectionName}, Draft-Collection: ${ctx.params.draftCollectionName}`
            );
            const data = await this.customCollectionRecordDelete(
                ctx.params.dbName,
                ctx.params.draftCollectionName,
                ctx.params.collectionName,
                ctx.params.workflow,
                ctx.params.docId,
                ctx.params.deletedBy
            );

            return JSON.stringify(data);
        },
    },

    methods: {
        async createCustomCollection(dbName, query, collectionName) {
            return await customCollectionsRepo
                .createCustomCollection(dbName, query, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async insertNewCollection(dbName, query, collectionName) {
            return await customCollectionsRepo
                .insertNewCollection(dbName, query, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async insertDynamicFormData(dbName, query, collectionName) {
            return await customCollectionsRepo
                .insertDynamicFormData(dbName, query, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        // async addCustomCollectionToFeature(
        //     dbName,
        //     customCollectionName,
        //     customCollectionDescription
        // ) {
        //     return await customCollectionsRepo
        //         .addCustomCollectionToFeature(
        //             dbName,
        //             customCollectionName,
        //             customCollectionDescription
        //         )
        //         .catch((error) => {
        //             return errorHandlerService.errorHandler(error);
        //         });
        // },

        async updateCollectionType(dbName, collectionName, pageId, updatedData) {
            return await customCollectionsRepo
                .updateCollectionType(dbName, collectionName, pageId, updatedData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getcustomCollectionTypes(dbName, query1, collectionName, user, sorter) {
            return await customCollectionsRepo
                .getcustomCollectionTypes(dbName, query1, collectionName, user, sorter)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async updateCollectionDoc(dbName, collectionName, pageId, updatedData) {
            return await customCollectionsRepo
                .updateCollectionDoc(dbName, collectionName, pageId, updatedData)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async uploadDocument(dbName, fileName) {
            return await customCollectionsRepo.uploadDocument(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getDocument(dbName, fileName) {
            return await customCollectionsRepo.getDocument(dbName, fileName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        /// common method to get collection documents , pass parameters : collection name and db name
        async getCollectionAll(dbName, collectionName) {
            return await customCollectionsRepo
                .getCollectionAll(dbName, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        // for the image serch
        async getImagesByTitle(dbName, query1, collectionName) {
            return await customCollectionsRepo
                .getImagesByTitle(dbName, query1, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        // for the image serch
        async getImagesByDesc(dbName, query1, collectionName) {
            return await customCollectionsRepo
                .getImagesByDesc(dbName, query1, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        //for the icons search
        async getIconsByFileName(dbName, query1, collectionName) {
            return await customCollectionsRepo
                .getIconsByFileName(dbName, query1, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        // for the video serch
        async getVideosByTitle(dbName, query1, collectionName) {
            return await customCollectionsRepo
                .getVideosByTitle(dbName, query1, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getAllCustomCollection(dbName) {
            return await customCollectionsRepo.getAllCustomCollection(dbName).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async saveAllCustomCollection(dbName, customCollections) {
            return await customCollectionsRepo
                .saveAllCustomCollection(dbName, customCollections)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async createCustomTree(dbName, title) {
            return await customCollectionsRepo.createCustomTree(dbName, title).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getAllCustomTrees(dbName, user) {
            return await customCollectionsRepo.getAllCustomTrees(dbName, user).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getCustomTreeById(dbName, id) {
            return await customCollectionsRepo.getCustomTreeById(dbName, id).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async updateCustomTree(dbName, id, tree) {
            return await customCollectionsRepo.updateCustomTree(dbName, id, tree).catch((error) => {
                return errorHandlerService.errorHandler(error);
            });
        },

        async getcustomCollectionDocsByCollectionAndId(dbName, mappingQuery) {
            return await customCollectionsRepo
                .getcustomCollectionDocsByCollectionAndId(dbName, mappingQuery)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getDocumentHistory(dbName, id, collection, limit) {
            return await customCollectionsRepo
                .getDocumentHistory(dbName, id, collection, limit)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getLastUpdatedDocumentMetaInfo(dbName, collection) {
            return await customCollectionsRepo
                .getLastUpdatedDocumentMetaInfo(dbName, collection)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getTreeCustomCollections(dbName, treeId, nodeId, nodePath) {
            return await customCollectionsRepo
                .getTreeCustomCollections(dbName, treeId, nodeId, nodePath)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async searchTreeCustomCollections(dbName, treeId, parentNodeIds, keyWord, sorting) {
            return await customCollectionsRepo
                .searchTreeCustomCollections(dbName, treeId, parentNodeIds, keyWord, sorting)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async deleteTreeCustomCollections(dbName, treeId, deletedBy) {
            return await customCollectionsRepo
                .deleteTreeCustomCollections(dbName, treeId, deletedBy)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async customCollectionRecordDelete(
            dbName,
            draftCollectionName,
            collectionName,
            workflow,
            docId,
            deletedBy
        ) {
            return await customCollectionsRepo
                .customCollectionRecordDelete(
                    dbName,
                    draftCollectionName,
                    collectionName,
                    workflow,
                    docId,
                    deletedBy
                )
                .catch((error) => {
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
