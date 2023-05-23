const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    FTP_STATIC_FOLDER: process.env.FTP_STATIC_FOLDER,
    DB_NAME: process.env.DB_NAME,
    ENABLE_AUTHORIZATION: process.env.ENABLE_AUTHORIZATION,
    CMS_DOCUMENTS: process.env.CMS_DOCUMENTS,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY,
    RECAPTCHA_VERIFY_URL: process.env.RECAPTCHA_VERIFY_URL,
};
