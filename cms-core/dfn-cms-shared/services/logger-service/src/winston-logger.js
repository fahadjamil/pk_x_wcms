const winston = require('winston');
const { format, transports } = winston;
const path = require('path');
require('winston-daily-rotate-file');
const { LOG_LEVEL } = require('../config/config');

const logFormat = format.printf(getLoggingFormat);

const MAX_FILES = '30d'; // keep files for 30 days
const MAX_FILE_SIZE = '2m'; //max file size for single log file (2m = 2 MB)

function getLoggingFormat(info) {
    const message = info.message ? info.message : JSON.stringify(info.metadata);
    return `${info.timestamp} ${info.level} [${info.label}]: ${message}`;
}

function addLogger(key) {
    if (key !== undefined && key !== null && key !== '') {
        winston.loggers.add(key, {
            format: format.combine(
                format.label({ label: path.basename(process.mainModule.filename) }),
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
            ),
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: `logs/${key}-%DATE%.log`,
                    level: LOG_LEVEL,
                    format: format.combine(logFormat),
                    maxFiles: MAX_FILES,
                    maxSize: MAX_FILE_SIZE,
                }),
            ],
            exitOnError: false,
        });
    }
}

function getLogger(key) {
    if (!winston.loggers.has(key)) {
        addLogger(key);
    }

    return winston.loggers.get(key);
}

module.exports = {
    addLogger: addLogger,
    getLogger: getLogger,
};
