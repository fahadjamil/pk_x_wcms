const mongodb = require('mongodb');
const Grid = require('gridfs-stream');
const MongoClient = mongodb.MongoClient;
const fs = require('fs');
const gridFsCollection = 'media';
const { DB_SERVER, UPLOAD_PATH, DB_POOL_SIZE, REPLICASET_NAME } = require('./../../config/config');
const connectionPoolMap = new Map();

async function getDBConnection(dbName) {
    if (connectionPoolMap.has(dbName)) {
        let client = connectionPoolMap.get(dbName);
        return client;
    } else {
        try {
            return await createDbConnection(dbName);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }
}

async function createDbConnection(dbName) {
    let client;
    let connectionString;
    if (REPLICASET_NAME) {
        connectionString = `${DB_SERVER}${dbName}` + '?replicaSet=' + REPLICASET_NAME;
    } else {
        connectionString = `${DB_SERVER}${dbName}`;
    }

    console.log(`Mongo DB Connection string ${connectionString}`);
    console.log('Mongo DB pool size ' + DB_POOL_SIZE);

    try {
        client = await MongoClient.connect(connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            poolSize: DB_POOL_SIZE,
        });

        connectionPoolMap.set(dbName, client);
        return client;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

async function createNewDbConnectionWhenErrorOccurred(dbName) {
    try {
        connectionPoolMap.get(dbName).close();
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
    try {
        connectionPoolMap.delete(dbName);
        await createDbConnection(dbName);
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const insertOne = async (doc, toCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(toCollection);
        const results = await collection.insertOne(doc);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const insertMany = async (docs, toCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(toCollection);
        const results = await collection.insertMany(docs);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findOne = async (query, fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let collection = dbConnection.db(dbName).collection(fromCollection);
        let results = await collection.findOne(query);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findAll = async (query, sorter, fromCollection, dbName, limit = 0, project = {}) => {
    const dbConnection = await getDBConnection(dbName);
    query = query ? query : {};
    sorter = sorter ? sorter : {};
    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection
            .find(query)
            .project(project)
            .sort(sorter)
            .limit(limit)
            .toArray();
        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findWithPagination = async (query, filter, sorter, limit, page, fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);
    query = query ? query : {};
    filter = filter ? filter : {};
    sorter = sorter ? sorter : {};
    page = page ? page : 0;
    limit = limit ? limit : 25;
    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection
            .find(query, filter)
            .sort(sorter)
            .skip(page * limit)
            .limit(limit)
            .toArray();
        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findWithFilter = async (query, filter, sorter, fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);
    query = query ? query : {};
    filter = filter ? filter : {};
    sorter = sorter ? sorter : {};
    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.find(query, filter).sort(sorter).toArray();
        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findOneAndUpdate = async (filter = {}, update = {}, fromCollection, dbName, options = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.updateOne(filter, update, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const update = async (filter = {}, update = {}, fromCollection, dbName, options = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.update(filter, update, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const updateMany = async (filter = {}, update = {}, fromCollection, dbName, options = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.updateMany(filter, update, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const createCollection = async (options, collectionName, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const results = dbConnection.db(dbName).createCollection(collectionName, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const find = async (query, sorter, fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);
    query = query ? query : {};

    console.log('Ad Redirect service called - Auth Repo Query: ', JSON.stringify(query));
    console.log(
        'Ad Redirect service called - Auth Repo fromCollection: ',
        JSON.stringify(fromCollection)
    );
    console.log('Ad Redirect service called - Auth Repo dbName: ', JSON.stringify(dbName));

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.find(query).toArray();

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const findOneAndReplace = async (
    filter = {},
    update = {},
    fromCollection,
    dbName,
    options = {}
) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.replaceOne(filter, update, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const getImageForDisplay = async (dbName, fileName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let results;
        const db = dbConnection.db(dbName);
        const gfs = Grid(db, mongodb);

        gfs.collection(gridFsCollection);
        results = await gfs.files.findOne({ filename: fileName });

        if (results) {
            return gfs.createReadStream(results.filename);
        } else {
            return '404';
        }
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const saveImage = async (dbName, fileName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const db = dbConnection.db(dbName);
        const bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: gridFsCollection,
        });

        const streamOut = fs
            .createReadStream(`${UPLOAD_PATH}/${fileName}`)
            .pipe(bucket.openUploadStream(fileName));

        const end = new Promise(function (resolve, reject) {
            streamOut.on('finish', () => resolve('success'));
            streamOut.on('error', reject);
        });

        const results = await end;
        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const saveDocument = async (dbName, fileName) => {
    const dbConnection = await getDBConnection(dbName);
    try {
        const db = dbConnection.db(dbName);
        const bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: 'cms-document-reports',
        });

        const streamOut = fs
            .createReadStream(`${UPLOAD_PATH}/${fileName}`)
            .pipe(bucket.openUploadStream(fileName));

        const end = new Promise(function (resolve, reject) {
            streamOut.on('finish', (data) => resolve(data));
            streamOut.on('error', reject);
        });

        const results = await end;
        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const deleteGridfsImage = async (dbName, id) => {
    const dbConnection = await getDBConnection(dbName);
    try {
        const db = dbConnection.db(dbName);
        const bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: 'media',
        });

        bucket.delete(id, (error) => {
            if (error) {
                console.log('error deleteGridfsImage -', error);
            }
        });
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const getDocumentForDisplay = async (dbName, fileName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let results;
        const db = dbConnection.db(dbName);
        const gfs = Grid(db, mongodb);

        gfs.collection('cms-document-reports');
        results = await gfs.files.findOne({ filename: fileName });

        if (results) {
            return gfs.createReadStream(results.filename);
        } else {
            return '404';
        }
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const deleteOne = async (filter = {}, fromCollection, dbName, options = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.deleteOne(filter, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const deleteMany = async (filter = {}, fromCollection, dbName, options = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.deleteMany(filter, options);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const getDocumentsCount = async (fromCollection, dbName, filter = {}) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(fromCollection);
        const results = await collection.countDocuments(filter);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const remove = async (query, fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let collection = dbConnection.db(dbName).collection(fromCollection);
        let results = await collection.deleteOne(query);

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const isCollectionExist = async (fromCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection =
            (await dbConnection.db(dbName).listCollections().toArray()).findIndex(
                (item) => item.name === fromCollection
            ) !== -1;

        if (collection) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const createWildCardIndex = async (options, collectionName, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let collection = dbConnection.db(dbName).collection(collectionName);
        let results = await collection.createIndex({ '$**': 'text' });

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const getIndexes = async (options, collectionName, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let collection = dbConnection.db(dbName).collection(collectionName);
        let results = await collection.getIndexes();

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

// copy all documents from one collection to a new collection
const copyTo = async (sourceCollection, toCollection, dbName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const collection = dbConnection.db(dbName).collection(sourceCollection);
        const results = await collection
            .aggregate([{ $match: {} }, { $out: toCollection }])
            .toArray();

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

const aggregate = async ( collectionName,dbName,query) => {
    const dbConnection = await getDBConnection(dbName);
    try {
        const collection = dbConnection.db(dbName).collection(collectionName);
        const results = await collection.aggregate(query).toArray();

        return results;
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

// TODO: This is a common function to save data into GridFs. Remove "saveDocument" and "saveImage" methods in the future.
const saveFileToGridfs = async (dbName, collectionName, fileName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const db = dbConnection.db(dbName);
        const bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: collectionName,
        });

        const end = new Promise(function (resolve, reject) {
            fs.createReadStream(`${UPLOAD_PATH}/${fileName}`)
                .on('error', (error) => {
                    console.log(error);
                    const err = {
                        status: 'failed',
                        msg: 'Something unexpected has occured. Please try again later.',
                    };

                    reject(err);
                })
                .pipe(bucket.openUploadStream(fileName))
                .on('finish', (data) => resolve(data))
                .on('error', (error) => {
                    console.log(error);
                    const err = {
                        status: 'failed',
                        msg: 'Database error occured. File upload failed.',
                    };

                    reject(err);
                });
        });

        return await end
            .then(async (data) => {
                const results = {
                    ...data,
                    status: 'success',
                    msg: 'File has uploaded successfully.',
                };

                return results;
            })
            .catch((error) => {
                return error;
            });
    } catch (error) {
        // TODO: Error msg for user - Common msg when throwing an error
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

// This is a common method for delete data from GridFs.
// TODO: Remove 'deleteGridfsImage' method and use this common method
const deleteFromGridfs = async (dbName, id, bucketName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        const db = dbConnection.db(dbName);
        const bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024 * 1024,
            bucketName: bucketName,
        });

        bucket.delete(id, (error) => {
            if (error) {
                console.log('error deleteGridfsImage -', error);
            }
        });
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

// TODO: Use GridFsBucket
const retrieveFileFromGridFs = async (dbName, collectionName, fileName) => {
    const dbConnection = await getDBConnection(dbName);

    try {
        let results;
        const db = dbConnection.db(dbName);
        const gfs = Grid(db, mongodb);

        gfs.collection(collectionName);
        results = await gfs.files.findOne({ filename: fileName });

        if (results) {
            return gfs.createReadStream(results.filename);
        } else {
            return '404';
        }
    } catch (error) {
        console.log(error);
        await createNewDbConnectionWhenErrorOccurred(dbName);
        throw new Error(error);
    }
};

module.exports.insertOne = insertOne;
module.exports.insertMany = insertMany;
module.exports.FindOne = findOne;
module.exports.findAll = findAll;
module.exports.findOneAndUpdate = findOneAndUpdate;
module.exports.update = update;
module.exports.updateMany = updateMany;
module.exports.findOneAndReplace = findOneAndReplace;
module.exports.createCollection = createCollection;
module.exports.getImageForDisplay = getImageForDisplay;
module.exports.find = find;
module.exports.saveImage = saveImage;
module.exports.saveDocument = saveDocument;
module.exports.getDocumentForDisplay = getDocumentForDisplay;
module.exports.findWithFilter = findWithFilter;
module.exports.deleteOne = deleteOne;
module.exports.deleteMany = deleteMany;
module.exports.getDocumentsCount = getDocumentsCount;
module.exports.findWithPagination = findWithPagination;
module.exports.remove = remove;
module.exports.isCollectionExist = isCollectionExist;
module.exports.deleteGridfsImage = deleteGridfsImage;
module.exports.createWildCardIndex = createWildCardIndex;
module.exports.getIndexes = getIndexes;
module.exports.copyTo = copyTo;
module.exports.saveFileToGridfs = saveFileToGridfs;
module.exports.deleteFromGridfs = deleteFromGridfs;
module.exports.retrieveFileFromGridFs = retrieveFileFromGridFs;
module.exports.aggregate=aggregate;
