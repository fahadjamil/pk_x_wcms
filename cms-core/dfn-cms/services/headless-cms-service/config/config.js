const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    PUBLISHER_NODE: process.env.PUBLISHER_NODE,
    AD_SALTED_VALUE: process.env.AD_SALTED_VALUE,
};
