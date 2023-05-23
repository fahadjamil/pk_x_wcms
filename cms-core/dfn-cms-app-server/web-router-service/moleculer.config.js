const BaseLogger = require('moleculer').Loggers.Base;
const logger = require('./logger/logger').logger;

class AppServerLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => logger.log(type, ...args);
    }
}

module.exports = {
    nodeID: 'app-web-router',
    transporter: 'Redis',
    envfile: '.env',
    metrics: true,
    serializer: 'JSON',
    logger: [
        {
            type: 'Console',
            options: {
                level: 'info',
            },
        },
        new AppServerLogger(),
    ],
};
