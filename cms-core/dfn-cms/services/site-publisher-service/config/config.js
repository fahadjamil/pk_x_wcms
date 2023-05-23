const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    BASE_PROXY_URL: process.env.BASE_PROXY_URL,

    FTP_HOST: process.env.FTP_HOST,
    FTP_PORT: process.env.FTP_PORT,
    FTP_USER: process.env.FTP_USER,
    FTP_PASSWORD: process.env.FTP_PASSWORD,
    ARCHIVE_FOLDER: process.env.ARCHIVE_FOLDER,
    GATSBY_PUBLIC_FOLDER: process.env.GATSBY_PUBLIC_FOLDER,
    FTP_TIME_OUT: process.env.FTP_TIME_OUT,
    GATSBY_CACHE_FOLDER: process.env.GATSBY_CACHE_FOLDER,
    GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
    SITEMGR_NODE: process.env.SITEMGR_NODE,
    WEBSITE_REDIS_URL: process.env.WEBSITE_REDIS_URL,
};
