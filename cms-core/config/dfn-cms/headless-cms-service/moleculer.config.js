const BaseLogger = require('moleculer').Loggers.Base;
const logger = require('./logger/logger').logger;

class HeadlessCmsLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => logger.log(type, ...args);
    }
}

module.exports = {
    transporter: 'redis://redis-service',

    tracing: {
        enabled: true,
        exporter: ['Console'],
    },

    logger: [
        {
            type: 'Console',
            options: {
                level: 'info',
            },
        },
        new HeadlessCmsLogger(),
    ],

    metrics: true,
    serializer: 'JSON',
};
