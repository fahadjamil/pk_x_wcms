const path = require('path');
const fetch = require(`node-fetch`);
const { BASE_PROXY_URL } = require('./config/config');
const fs = require('fs');
const logger = require('./logger/logger').logger;
const errorHandlerService = require('error-handler').errorHandler(logger);
const del = require('del');
const extract = require('extract-zip');
// const loadablePlugin = require('@loadable/webpack-plugin');

let pages,
    pagesData = {},
    themes,
    languages,
    images,
    videos,
    icons,
    pageMenuNames,
    masterTemplates = {},
    masterTemplateContents = {},
    url = BASE_PROXY_URL;

async function fetchData(url) {
    const result = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
    const resultData = await result.json();
    return resultData;
}

async function fetchImage(url, filename) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const DIR = './public/images/';

    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
    }

    try {
        fs.writeFileSync(DIR + filename, buffer);
    } catch (error) {
        console.error(error);
    }
}

async function fetchVideo(url, filename) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const DIR = './public/videos/';

    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
    }

    try {
        fs.writeFileSync(DIR + filename, buffer);
    } catch (error) {
        console.error(error);
    }
}

async function fetchStaticResource(url, filename, fileType) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const DIR = './public/';
    const absutePath = __dirname + '/public/';

    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
    }

    try {
        fs.writeFileSync(DIR + filename, buffer);

        // TODO: Use switchcase here
        if (fileType === 'zip' || fileType === 'rar') {
            let extractData = new Promise(async function (resolve, reject) {
                // TODO: Skip unzipping if file size is zero
                if (fileType === 'zip') {
                    await extract(absutePath + filename, { dir: absutePath });
                    resolve();
                } else if (fileType === 'rar') {
                    resolve();
                } else {
                    reject();
                }
            });

            await extractData
                .then(async () => {
                    const deletedFilePaths = await del([`${absutePath + filename}`]);
                    console.log('----------------DELETED FILE PATHS-------------------');
                    console.log(deletedFilePaths);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    } catch (error) {
        console.error(error);
    }
}

async function fetchIcon(url, filename) {
    const response = await fetch(url);
    const buffer = await response.buffer();

    const DIR = './public/icons/';

    if (!fs.existsSync(DIR)) {
        fs.mkdirSync(DIR);
    }

    try {
        fs.writeFileSync(DIR + filename, buffer);
    } catch (error) {
        console.error(error);
    }
}

let dataBaseName = '';
let publishLevel = '';

exports.onPreInit = async (_, pluginOptions) => {
    const paramsText = fs.readFileSync('db_name.txt', 'utf8');
    const paramsData = JSON.parse(paramsText);
    dataBaseName = paramsData.dbName;
    publishLevel = paramsData.publishLevel;
};

async function storeImages(images) {
    for (const imageItem of images) {
        const filePath = url + imageItem.filePath.replace('/api/', '');
        await fetchImage(filePath, imageItem.fileName);
    }
}

async function storeVideos(videos) {
    for (const videoItem of videos) {
        const filePath = url + videoItem.filePath.replace('/api/', '');
        await fetchVideo(filePath, videoItem.fileName);
    }
}

async function storeStaticResources(staticResources) {
    const DIR = './public/';

    for (const staticResource of staticResources) {
        const { fileUrl, uploadFileName, fileType } = staticResource;
        const filePath = url + fileUrl.replace('/api/', '');

        await fetchStaticResource(filePath, uploadFileName, fileType);
    }
}

async function storeIcons(icons) {
    for (const iconItem of icons) {
        const filePath = url + iconItem.filePath.replace('/api/', '');
        await fetchIcon(filePath, iconItem.fileName);
    }
}

async function getPageLanguage(pageDataRef) {
    return languages.find((langElement) => langElement.langKey === pageDataRef.lang);
}

function getPageTitleForLanguage(page, language) {
    const pageId = page._id.toString();
    const langKey = language.langKey.toLowerCase();

    if (
        page.pageInfo &&
        page.pageInfo.pageTitle &&
        page.pageInfo.pageTitle[langKey] &&
        page.pageInfo.pageTitle[langKey].toString() !== ''
    ) {
        return page.pageInfo.pageTitle[langKey].toString();
    } else if (
        pageMenuNames &&
        pageMenuNames[pageId] &&
        pageMenuNames[pageId][langKey].toString() &&
        pageMenuNames[pageId][langKey].toString() !== ''
    ) {
        return pageMenuNames[pageId][langKey].toString();
    } else {
        return page.pageName;
    }
}

async function getTemplateData(result) {
    return result.templateData.map((templateDataItem) => {
        return templateDataItem.id;
    });
}

async function createPagesAsync(
    pageDataRef,
    page,
    template,
    templateData,
    pageLanguage,
    pagePath,
    createPage,
    pageData,
    pageTitle
) {
    let previewData = {
        pageData,
        page,
        themes,
        template,
        templateData,
        pageLanguage,
        dataBaseName,
        pageTitle,
    };

    //language wise page path
    let pageBuildPath = `/${pageDataRef.lang.toLowerCase()}/${pagePath}`;

    createPage({
        path: pageBuildPath,
        component: require.resolve('./src/publisher-preview/PreviewPageWrapperComponent.js'),
        context: {
            paramsData: { ...previewData },
        },
    });
}

exports.onPostBuild = async () => {
    try {
        const paramsText = fs.readFileSync('db_name.txt', 'utf8');
        const paramsData = JSON.parse(paramsText);
        dataBaseName = paramsData.dbName;

        images = await fetchData(
            url + 'custom-collections/all?dbName=' + dataBaseName + '&collection=media-images'
        );

        videos = await fetchData(
            url + 'custom-collections/all?dbName=' + dataBaseName + '&collection=media-videos'
        );

        // Create static resources into public folder
        let staticResources = await fetchData(
            url + 'collection/data/all?dbName=' + dataBaseName + '&collection=static-resources'
        );

        icons = await fetchData(
            url + 'custom-collections/all?dbName=' + dataBaseName + '&collection=media-icons'
        );

        await storeImages(images);
        await storeVideos(videos);
        await storeStaticResources(staticResources);
        await storeIcons(icons);
    } catch (error) {
        console.error(error);
    }
};

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    actions.setWebpackConfig({
        // plugins: [new loadablePlugin()],
        resolve: {
            alias: {
                react: path.resolve('./node_modules/react'),
            },
        },
    });

    if (stage === 'build-html' || stage === "develop-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /jspdf/,
                        use: loaders.null(),
                    },
                    {
                        test: /jspdf-autotable/,
                        use: loaders.null(),
                    },
                    // {
                    //     test: /ckeditor5-build-classic/,
                    //     use: loaders.null(),
                    // },
                    // {
                    //     test: '/@ckeditor/ckeditor5-react/',
                    //     use: loaders.null(),
                    // },
                    {
                        test: /react-data-table-component-extensions/,
                        use: loaders.null(),
                    },
                ],
            },
        });
    }
};

exports.createPages = async function ({ actions }) {
    logger.info('GATSBY create pages.');
    console.log('CREATE PAGES');
    try {
        const { createPage, deletePage, setWebpackConfig } = actions;

        await fetchData(
            `${url}publish/get-pages-publish?dbName=${dataBaseName}&publishLevel=${publishLevel}`
        ).then(
            (data) => {
                logger.info(
                    `GATSBY get pages publish api called and data recived. DBName: ${dataBaseName}, Publish level: ${publishLevel}`
                );
                console.log('GET PAGES PUBLISH');
                pages = data;
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(
            `${url}pages/data/publish?dbName=${dataBaseName}&publishLevel=${publishLevel}`
        ).then(
            (data) => {
                logger.info(
                    `GATSBY get approved pages data api called and data recived. DBName: ${dataBaseName}, Publish level: ${publishLevel}`
                );
                console.log('APPROVED PAGES DATA ');
                pagesData = {};
                for (const pageDataContent of data) {
                    pagesData[pageDataContent._id.toString()] = pageDataContent;
                }
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(`${url}themes?dbName=${dataBaseName}`).then(
            (data) => {
                logger.info(
                    `GATSBY get themes api called and data recived. DBName: ${dataBaseName}, Publish level: ${publishLevel}`
                );
                console.log('GET THEMES');
                themes = data;
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(`${url}websites/languages/data?dbName=${dataBaseName}`).then(
            (data) => {
                logger.info(
                    `GATSBY get language data called and data recived. DBName: ${dataBaseName}, Publish level: ${publishLevel}`
                );
                console.log('GET LANGUAGES DATA');
                languages = data;
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(
            `${url}templates/data/publish?dbName=${dataBaseName}&publishLevel=${publishLevel}`
        ).then(
            (data) => {
                logger.info(
                    `GATSBY get master templates api called and data recived. DBName: ${dataBaseName}, Publish level: ${publishLevel}`
                );
                console.log('GET MASTER TEMPALTES');
                masterTemplates = {};
                for (const masterTemplate of data) {
                    masterTemplates[masterTemplate._id.toString()] = masterTemplate;
                }
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(
            `${url}templates/content/publish?dbName=${dataBaseName}&publishLevel=${publishLevel}`
        ).then(
            (data) => {
                logger.info(
                    `GATSBY get master template content api called and data recived. DBName: ${dataBaseName}`
                );
                console.log('GET MASTER TEMPALTES CONTENT');
                masterTemplateContents = {};
                for (const masterTemplateContentData of data) {
                    masterTemplateContents[
                        masterTemplateContentData._id.toString()
                    ] = masterTemplateContentData;
                }
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        await fetchData(`${url}menus/names?dbName=${dataBaseName}`).then(
            (data) => {
                logger.info(
                    `GATSBY get menu names api called and data recived. DBName: ${dataBaseName}`
                );
                console.log('GET MENU NAMES');
                pageMenuNames = data;
            },
            (error) => {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        );

        logger.info(`GATSBY get static resources links api called. DBName: ${dataBaseName}`);
        const staticResourcesLinks = await fetchData(
            url +
            'collection/data/all?dbName=' +
            dataBaseName +
            '&collection=static-resources-links'
        );

        if (staticResourcesLinks && staticResourcesLinks.length > 0) {
            let sectionsLinks = {};

            for (link of staticResourcesLinks) {
                const { section } = link;
                sectionsLinks[section] = link;
            }

            fs.writeFileSync('static-resources.txt', JSON.stringify(sectionsLinks), 'utf8');
        }

        for (const page of pages) {
            try {
                const { isHomePage } = page;
                const pagePath = isHomePage
                    ? ''
                    : page.path.length > 0
                        ? page.path
                        : 'unlinked/' + page.pageName.toLowerCase().replace(/\s/g, '');

                const template = masterTemplates[page.masterTemplate];

                for (const pageDataRef of page.pageData) {
                    const pageLanguage = await getPageLanguage(pageDataRef);
                    const pageContentData = pagesData[pageDataRef.id];

                    let masterTemplateDataMap = undefined;
                    if (template && template.templateData) {
                        masterTemplateDataMap = template.templateData.find(
                            (dataItem) =>
                                dataItem.lang.toLowerCase() === pageDataRef.lang.toLowerCase()
                        );
                    }

                    let templateData = undefined;
                    if (masterTemplateDataMap && masterTemplateDataMap.id) {
                        templateData = masterTemplateContents[masterTemplateDataMap.id];
                    }

                    const pageTitle = getPageTitleForLanguage(page, pageLanguage);

                    await createPagesAsync(
                        pageDataRef,
                        page,
                        template,
                        templateData,
                        pageLanguage,
                        pagePath,
                        createPage,
                        pageContentData,
                        pageTitle
                    );
                }
            } catch (error) {
                errorHandlerService.errorHandler(error);
                console.log(error);
            }
        }
    } catch (error) {
        errorHandlerService.errorHandler(error);
        console.error(error);
        throw error;
    }
};
