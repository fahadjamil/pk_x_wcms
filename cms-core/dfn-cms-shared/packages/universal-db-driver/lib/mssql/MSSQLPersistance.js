const {
    MSSQL_DB_USER_1,
    MSSQL_DB_PASSWORD_1,
    MSSQL_DB_SERVER_1,
    MSSQL_DB_PORT_1,
    MSSQL_DB_DATABASE_1,
    MSSQL_DB_USER_2,
    MSSQL_DB_PASSWORD_2,
    MSSQL_DB_SERVER_2,
    MSSQL_DB_PORT_2,
    MSSQL_DB_DATABASE_2,
} = require('./../../config/config');
var sql = require('mssql');
let isPrimary = true;

const dbConfig1 = {
    user: MSSQL_DB_USER_1,
    password: MSSQL_DB_PASSWORD_1,
    server: MSSQL_DB_SERVER_1,
    port: parseInt(MSSQL_DB_PORT_1),
    database: MSSQL_DB_DATABASE_1,
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};

const dbConfig2 = {
    user: MSSQL_DB_USER_2,
    password: MSSQL_DB_PASSWORD_2,
    server: MSSQL_DB_SERVER_2,
    port: parseInt(MSSQL_DB_PORT_2),
    database: MSSQL_DB_DATABASE_2,
    options: {
        encrypt: true,
        enableArithAbort: true,
    },
};

let logger;

function setLogger(loggerObj) {
    logger = loggerObj;
}




async function haConnection() {
    try {
      const dbConn = await new sql.ConnectionPool(isPrimary ? dbConfig1 : dbConfig2).connect();
      return dbConn;
    } catch (error) {
      console.log(error.stack);
      return -1;
    }
  }
  
  async function getDBConnction() {
    let dbConnection = await haConnection();
    if (dbConnection == -1) {
      console.log('First connection failed try second connection')
      if(isPrimary){
        isPrimary = false;
      }else{
        isPrimary = true;
      }
      dbConnection = await haConnection();
      if (dbConnection == -1) {
        console.log('Second connection failed')
        throw new Error('Unable to Connect MSSQL DB, Please Check');
      } else {
        console.log('Second connection success')
        return dbConnection;
      }
    } else {
      console.log('First connection success')
      return dbConnection;
    }
  }

//   async function getDBConnction() {
//     try {
//         const dbConn = await new sql.ConnectionPool(dbConfig).connect();
//         console.log('Connected to MSSQL DB');
//         return dbConn;
//     } catch (error) {
//         console.log(error.stack);
//         throw new Error('Unable to Connect MSSQL DB, Please Check');
//     }
// }

const executeQuery = async function (query, params) {
    try {
        const dbConnection = await getDBConnction();
        const request = dbConnection.request();

        for (var i = 0, l = params.length; i < l; i++) {
            // request.input(params[i].param, params[i].type, params[i].value);
            request.input(params[i].param, params[i].value);
        }

        const result = await request.query(query);
        dbConnection.close(); // TODO : Check
        return result;
    } catch (error) {
        if (logger) {
            logger.error(`MSSQL Persistance - Execute Query Error - ${error.stack}`);
        }

        console.log(error.message);
        return -1;
    }
};

const executeProcedure = async function (query, params) {
    try {
        const dbConnection = await getDBConnction();
        const request = dbConnection.request();

        for (var i = 0, l = params.length; i < l; i++) {
            // request.input(params[i].param, params[i].type, params[i].value);
            request.input(params[i].param, params[i].value);
        }

        const result = await request.execute(query);
        dbConnection.close(); // TODO : Check
        return result;
    } catch (error) {
        if (logger) {
            logger.error(`MSSQL Persistance - Execute Procedure Error - ${error.stack}`);
        }

        console.log(error.message);
        return -1;
    }
};

const executeTransaction = async function (queries) {
    try {
        const dbConnection = await getDBConnction();
        const transaction = await new sql.Transaction(dbConnection);
        const request = dbConnection.request(transaction);

        await transaction.begin();

        try {
            const result = await request.query(queries);

            transaction.commit();
            dbConnection.close();

            return result;
        } catch (error) {
            transaction.rollback();
            dbConnection.close();
            throw error;
        }
    } catch (error) {
        if (logger) {
            logger.error(`MSSQL Persistance - Execute Transaction Error - ${error.stack}`);
        }

        console.log(error);
        return -1;
    }
};

module.exports.setLogger = setLogger;
module.exports.executeQuery = executeQuery;
module.exports.executeProcedure = executeProcedure;
module.exports.executeTransaction = executeTransaction;
