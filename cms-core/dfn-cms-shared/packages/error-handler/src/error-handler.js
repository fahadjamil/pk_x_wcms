//const loggerService = require('../../../services/logger-service').logger;
//const logger = loggerService.getLogger('webrouter');

module.exports = function (logger) {
    this.serviceErrorHandler = async function (error, req, res, next) {
        const customErrorMessage = commonErrorHandler(error);
        res.status(error.status || 500);
        res.json(customErrorMessage);
    };

    this.errorHandler = function (error) {
        return commonErrorHandler(error);
    };

    function commonErrorHandler(error){
        console.log(error);
        logger.log('error', error);
        logger.log('error', error.stack);
        const customErrorMessage = { error: { message: error.message } };
        return customErrorMessage;
    }

    return this;
};
