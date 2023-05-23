const pagesRepo = require('../pages/pages-repo');
const workFlowRepo = require('../workflows/workflows-repo');
const dbDriver = require('universal-db-driver').DBPersistance();
const websites = require('../websites/websites-repo');

// IN USE
async function postRelease(dbName, query, publishLevel) {
    try {
        const document = query;
        const response = await dbDriver.insertOne(document, 'releases', dbName);

        const data = {
            status: 'failed',
            msg: 'Release process failed',
        };
        // await postReleaseProgress(dbName, 'inprogress');

        if (response.result.ok === 1) {
            data.status = 'success';
            data.msg = 'Release process success';
        }

        return data;
    } catch (error) {
        console.error(error);
        const data = {
            status: 'failed',
            msg: 'Something unexpected has occured. Please try again later.',
        };

        return data;
    }
}

async function postReleaseProgress(dbName, status) {
    let siteVersion = 1;
    const document = { status: status, lastReleaseDate: new Date() };

    await dbDriver.deleteMany({}, 'release-progress', dbName).catch((error) => {
        return errorHandlerService.errorHandler(error);
    });

    const data = await dbDriver.insertOne(document, 'release-progress', dbName).catch((error) => {
        return errorHandlerService.errorHandler(error);
    });

    if (status === 'published') {
        workFlowRepo.UpdateWorkFlowsToPublished(dbName);
        siteVersion = await websites.getWebsiteVersion(dbName);
        siteVersion++;
        await websites.updateWebsiteVersion(dbName, { version: siteVersion });
    }

    return data;
}

async function getReleaseProgress(dbName) {
    try {
        const data = await dbDriver.findAll({}, {}, 'release-progress', dbName);

        if (data && data[0]) {
            const statusDoc = data[0];
            const { status } = statusDoc;

            return {
                status: status,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            status: 'failed',
        };
    }
}

async function setReleaseProgressToUnpblished(dbName) {
    const filter = { status: 'inprogress' };
    const update = { $set: { status: 'unpublished' } };
    const data = await dbDriver.findOneAndUpdate(filter, update, 'release-progress', dbName);
    return data;
}

async function getPublishablePages(dbName, publishLevel) {
    let data = undefined;
    let workFlowIds = [];
    const workFlows = await workFlowRepo.getPublishablePageWorkflowsByLevel(dbName, publishLevel);
    Object.keys(workFlows).forEach((key) => {
        workFlowIds.push(String(workFlows[key]._id));
    });

    const pagesToPublish = await pagesRepo.getPagesByWorkflowArry(dbName, workFlowIds);
    data = pagesToPublish;
    return data;
}

async function getReleases(dbName) {
    let data = undefined;
    let sorter = { PublishedDate: -1 };
    data = await dbDriver.findAll('', sorter, 'releases', dbName, 5);
    return data;
}

async function isReleaseInprogress(dbName) {
    try {
        const data = await dbDriver.findAll({}, {}, 'release-progress', dbName);

        if (data) {
            if (data.length === 0) {
                return false;
            }

            const statusDoc = data[0];
            const { status } = statusDoc;

            if (status && status !== 'inprogress') {
                return false;
            }
        }

        return true;
    } catch (error) {
        console.error(error);
        return true;
    }
}

module.exports = {
    postRelease: postRelease,
    getPublishablePages: getPublishablePages,
    getReleases: getReleases,
    postReleaseProgress: postReleaseProgress,
    getReleaseProgress: getReleaseProgress,
    isReleaseInprogress: isReleaseInprogress,
    setReleaseProgressToUnpblished: setReleaseProgressToUnpblished,
};
