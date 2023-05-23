const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    //BASE_URL: process.env.BASE_URL
    AD_APP_ID: process.env.AD_APP_ID,
    AD_APP_CODE: process.env.AD_APP_CODE,
    AD_SALTED_VALUE: process.env.AD_SALTED_VALUE,
    AD_LOGIN_URL: process.env.AD_LOGIN_URL,
};
