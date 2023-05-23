const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    HOST_NAME: process.env.HOST_NAME,
    PAYMENT_APP_ENDPOINT: process.env.PAYMENT_APP_ENDPOINT,
};
