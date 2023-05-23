const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    DB_SERVER: process.env.DB_SERVER,
    DB_POOL_SIZE:process.env.DB_POOL_SIZE,
    UPLOAD_PATH: process.env.UPLOAD_PATH,
    REPLICASET_NAME: process.env.REPLICASET_NAME,
    MSSQL_DB_USER_1: process.env.MSSQL_DB_USER_1,
    MSSQL_DB_PASSWORD_1: process.env.MSSQL_DB_PASSWORD_1,
    MSSQL_DB_SERVER_1: process.env.MSSQL_DB_SERVER_1,
    MSSQL_DB_PORT_1: process.env.MSSQL_DB_PORT_1,
    MSSQL_DB_DATABASE_1: process.env.MSSQL_DB_DATABASE_1,
    MSSQL_DB_USER_2: process.env.MSSQL_DB_USER_2,
    MSSQL_DB_PASSWORD_2: process.env.MSSQL_DB_PASSWORD_2,
    MSSQL_DB_SERVER_2: process.env.MSSQL_DB_SERVER_2,
    MSSQL_DB_PORT_2: process.env.MSSQL_DB_PORT_2,
    MSSQL_DB_DATABASE_2: process.env.MSSQL_DB_DATABASE_2
};
