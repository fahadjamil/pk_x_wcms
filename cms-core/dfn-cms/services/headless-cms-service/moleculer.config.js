const BaseLogger = require('moleculer').Loggers.Base;
const logger = require('./logger/logger').logger;

class HeadlessCmsLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => logger.log(type, ...args);
    }
}

module.exports = {
    nodeID: 'node-headless-cms',
    logger: [
        {
            type: 'Console',
            options: {
                level: 'info',
            },
        },
        new HeadlessCmsLogger(),
    ],

    transporter: 'Redis',
    // requestTimeout: 5 * 1000,

    // circuitBreaker: {
    //   enabled: true,
    // },
    // metrics: {
    //   enabled: true,
    //   reporter: ['Console'],
    // },
    //envfile: './../../../config/development.env',

    tracing: {
        enabled: true,
        exporter: ['Console'],
    },

    metrics: true,
    serializer: 'JSON',
};
