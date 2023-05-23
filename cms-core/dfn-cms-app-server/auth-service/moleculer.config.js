const BaseLogger = require('moleculer').Loggers.Base;
const logger = require('./src/logger/logger').logger;

class AuthLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => logger.log(type, ...args);
    }
}

module.exports = {
    nodeID: 'node-app-server-auth',
    logger: [
        {
            type: 'Console',
            options: {
                level: 'info',
            },
        },
        new AuthLogger(),
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
