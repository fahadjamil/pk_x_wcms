const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    UPLOAD_PATH: process.env.UPLOAD_PATH,
    HEADLESS_NODE: process.env.HEADLESS_NODE,
    WEBSITE_REDIS_URL: process.env.WEBSITE_REDIS_URL,
};
