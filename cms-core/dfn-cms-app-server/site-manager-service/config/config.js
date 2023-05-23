const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    FTP_HOST:process.env.FTP_HOST,
    FTP_PORT: process.env.FTP_PORT,
    FTP_PASV_PORT: process.env.FTP_PASV_PORT,
    FTP_PASV_PORT_END: process.env.FTP_PASV_PORT_END,
    FTP_USER: process.env.FTP_USER,
    FTP_PASSWORD: process.env.FTP_PASSWORD,
    FTP_ROOT_FOLDER: process.env.FTP_ROOT_FOLDER,
    FTP_STATIC_FOLDER: process.env.FTP_STATIC_FOLDER,
    CMS_DOCUMENTS: process.env.CMS_DOCUMENTS,
};
