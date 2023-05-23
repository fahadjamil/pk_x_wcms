const dotenv = require('dotenv');
dotenv.config();
const responseCodes = {
    success: 1,
    actionFailed: -1,
    validationError: -2,
    exception: -3,
};

const contactUsTypes = {
    informationCenter: 1,
    investorRelations: 2,
    whistleblowing: 3,
    mobile: 4
};

const emailAddresses = {
    info: process.env.INFO,
    applicationAlert: process.env.APPLICATION_ALERT,
    whistleblowing: process.env.WHISTLE_BLOWING,
    investorRelations: process.env.INVESTOR_RELATIONS
}

module.exports = {
    responseCodes: responseCodes,
    contactUsTypes: contactUsTypes,
    emailAddresses: emailAddresses
};
