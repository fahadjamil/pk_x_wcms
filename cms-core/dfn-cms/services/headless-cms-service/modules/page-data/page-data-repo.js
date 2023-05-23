const dbDriver = require('universal-db-driver').DBPersistance();
const ObjectID = require('mongodb').ObjectID;
const {
    commonDatabase,
    commonDbCollectionList,
    collectionsList,
    cmsPermissionIds,
} = require('../../constants/collections-list');
const sharedRepo = require('../shared/shared-repo');
const pagesRepo = require('../pages/pages-repo');

async function getContentData(dbName, id) {
    const query = { id: id };
    const data = await dbDriver.FindOne(query, collectionsList.pageContentDrafts, dbName);

    return data;
}

async function getAllContentData(dbName, idList) {
    let data = undefined;

    if (idList) {
        const objIdList = idList.map((id) => {
            return ObjectID(id);
        });

        const query = { _id: { $in: objIdList } };
        data = await dbDriver.findAll(query, '', collectionsList.pageContentDrafts, dbName);
    }

    return data;
}

async function getAllPageData(dbName) {
    const data = await dbDriver.findAll({}, '', collectionsList.pageContentDrafts, dbName);
    return data;
}

async function getPublishablePageData(dbName, publishLevel) {
    let approvedWfData = undefined;
    let pageDataId = [];
    let query = { $and: [{ state: 'approved' }, { fileType: 'Page' }] };

    if (publishLevel === 'published') {
        query = {
            $and: [{ $or: [{ state: 'published' }, { state: 'approved' }] }, { fileType: 'Page' }],
        };
    }

    approvedWfData = await dbDriver.findAll(query, '', collectionsList.workflows, dbName);

    const objIdList = approvedWfData.map((worflow) => {
        return worflow._id.toString();
    });

    const query2 = { workflowStateId: { $in: objIdList } };
    const pageDrafts = await dbDriver.findAll(query2, '', collectionsList.pageDrafts, dbName);

    pageDrafts.forEach((pages) => {
        pages.pageData.forEach((pageData) => {
            pageDataId.push(pageData.id);
        });
    });

    const objIdList2 = pageDataId.map((id) => {
        return ObjectID(id);
    });

    const query3 = { _id: { $in: objIdList2 } };
    const pageContentDrafts = await dbDriver.findAll(
        query3,
        '',
        collectionsList.pageContentDrafts,
        dbName
    );

    return pageContentDrafts;
}

async function getImage(dbName, fileName) {
    const data = await dbDriver.getImageForDisplay(dbName, fileName);
    return data;
}

async function insertPageData(dbName, query) {
    const data = await dbDriver.insertOne(query, collectionsList.pageContentDrafts, dbName);
    return data;
}

async function insertSectionData(dbName, pageId, sectionData) {
    let filter = {};
    let update = {};

    filter.id = pageId;
    update = {
        $push: { data: sectionData },
    };

    const data = await dbDriver.findOneAndUpdate(
        filter,
        update,
        collectionsList.pageContentDrafts,
        dbName
    );

    return data;
}

async function updateComponentData(dbName, pageId, updatedData) {
    let filter = {};

    filter = {
        _id: ObjectID(pageId),
    };

    const data = await dbDriver.findOneAndReplace(
        filter,
        updatedData,
        collectionsList.pageContentDrafts,
        dbName
    );

    return data;
}

async function updateAllPageComponentData(dbName, pageId, updatedPageContent) {
    const data = [];
    const query = { _id: ObjectID(pageId) };
    const page = await dbDriver.FindOne(query, collectionsList.pageDrafts, dbName);

    for (const lnaguageKey of Object.keys(updatedPageContent)) {
        let pageDataItem = undefined;

        if (page.pageData) {
            pageDataItem = page.pageData.find((pageDataItem) => pageDataItem.lang === lnaguageKey);
        }

        if (pageDataItem) {
            const filter = { _id: ObjectID(pageDataItem.id) };
            const res = await dbDriver.findOneAndReplace(
                filter,
                updatedPageContent[lnaguageKey],
                collectionsList.pageContentDrafts,
                dbName
            );
            data.push({ ...res, docObjId: pageDataItem.id });
        } else {
            const res = await dbDriver.insertOne(
                updatedPageContent[lnaguageKey],
                collectionsList.pageContentDrafts,
                dbName
            );

            if (res.result.ok === 1) {
                const pageDataContent = {
                    id: updatedPageContent[lnaguageKey]._id.toString(),
                    lang: lnaguageKey,
                };
                const filter = { _id: ObjectID(pageId) };
                const query = { $push: { pageData: pageDataContent } };

                await dbDriver.findOneAndUpdate(filter, query, collectionsList.pageDrafts, dbName);
            }

            data.push({ ...res, docObjId: updatedPageContent[lnaguageKey]._id.toString() });
        }
    }
    return data;
}

async function uploadImage(dbName, fileName) {
    const data = await dbDriver.saveImage(dbName, fileName);
    let results = {};

    if (data === 'success') {
        results = {
            fileName: fileName,
            filePath: `/api/page-data/getImage/${dbName}/${fileName}`,
        };
    }

    return results;
}

async function ReplaceImageFile(dbName, thumbnailUri, fileName) {
    let data = undefined;
    const query = { fileName: fileName };
    console.log('thumbnailUri --------------3', thumbnailUri);
    data = await dbDriver.updateMany(
        query,
        { $set: { thumbnailUri: thumbnailUri } },
        'media-images',
        dbName
    );
    console.log('data --------in side ReplaceImageFile', data);
    return data;
}

async function ckEditorUploadImage(dbName, fileName) {
    const data = await dbDriver.saveImage(dbName, fileName);
    let results = {};

    if (data === 'success') {
        results = {
            url: `/api/page-data/getImage/${dbName}/${fileName}`,
        };
    }

    return results;
}

module.exports = {
    getContentData: getContentData,
    getAllContentData: getAllContentData,
    getAllPageData: getAllPageData,
    getImage: getImage,
    insertPageData: insertPageData,
    insertSectionData: insertSectionData,
    updateComponentData: updateComponentData,
    updateAllPageComponentData: updateAllPageComponentData,
    uploadImage: uploadImage,
    ckEditorUploadImage: ckEditorUploadImage,
    ReplaceImageFile: ReplaceImageFile,
    getPublishablePageData: getPublishablePageData,
};
