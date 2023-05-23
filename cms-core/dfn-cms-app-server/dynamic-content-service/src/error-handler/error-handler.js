const logger = require('../logger/logger').logger;
const errorHandlerService = require('error-handler').errorHandler(logger);

module.exports.errorHandlerService = errorHandlerService;
