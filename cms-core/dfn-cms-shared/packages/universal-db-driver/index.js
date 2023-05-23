const MongoPersistence = require('./lib/mongo/MongoPersistance');
const MSSQLPersistence = require('./lib/mssql/MSSQLPersistance');

var DBPersistance = function () {
    //we have to get the DB configuration according that we will return mongo or sql server
    // if (global.gConfig.db_type === 'mongo') {
    return MongoPersistence;
    // } else {
    // return MSSQLPersistence;
    // }
};

var DBPersistanceByType = function (dbType, logger) {
    if (dbType === 'mongo') {
        return MongoPersistence;
    } else if (dbType === 'mssql') {
        if (logger) {
            MSSQLPersistence.setLogger(logger)
        }
        
        return MSSQLPersistence;
    }
};

module.exports.DBPersistance = DBPersistance;
module.exports.DBPersistanceByType = DBPersistanceByType;
