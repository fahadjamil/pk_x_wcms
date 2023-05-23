const siteSearchRepo = require('../modules/site-search/site-search-repo');
const logger = require('../logger/logger').logger;
const errorHandlerService = require('../error-handler/error-handler').errorHandlerService;

module.exports = {
    name: 'cms.site-search',

    actions: {
        async getSiteSearchResults(ctx) {
            logger.info(
                `CMS get Site Search called. DBName: ${ctx.params.dbName}, keyword: ${ctx.params.keyword}`
            );

            const menuData = await this.getSiteSearchMenuResults(
                ctx.params.dbName,
                ctx.params.keyword,
                ctx.params.langKey
            );

            const collectionList = ctx.params.collectionList;

            let collectionResults = [];

            const isSearchableCollection = (collection) => {
                if (collection.customeCollectionName.includes('docs-executive-team')) {
                    return false;
                }
                return true;
            };

            for (const collection of collectionList) {
                // checking for collections which should not be considered for search
                if (isSearchableCollection(collection)) {
                    const collectionData = await this.getSiteSearchCollectionResults(
                        ctx.params.dbName,
                        ctx.params.keyword,
                        ctx.params.langKey,
                        collection.customeCollectionName
                    );
                    if (collectionData.length > 0) {
                        let colData = {
                            collectionName: collection.menuName,
                            collectionData: collectionData,
                        };
                        collectionResults.push(colData);
                    }
                }
            }

            const pageData = await this.getSiteSearchPageResults(
                ctx.params.dbName,
                ctx.params.keyword,
                ctx.params.langKey
            );

            return {
                menu: menuData,
                customCollections: collectionResults,
                pageContent: pageData,
            };
        },
    },

    methods: {
        async getSiteSearchMenuResults(dbName, keyword, langKey) {
            return await siteSearchRepo
                .getSiteSearchMenuResults(dbName, keyword, langKey)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getSiteSearchCollectionResults(dbName, keyword, langKey, collectionName) {
            return await siteSearchRepo
                .getSiteSearchCollectionResults(dbName, keyword, langKey, collectionName)
                .catch((error) => {
                    return errorHandlerService.errorHandler(error);
                });
        },

        async getSiteSearchPageResults(dbName, keyword, langKey) {
            return await siteSearchRepo
                .getSiteSearchPageResults(dbName, keyword, langKey)
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
