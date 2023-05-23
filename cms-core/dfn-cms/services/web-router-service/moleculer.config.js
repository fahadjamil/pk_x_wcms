const BaseLogger = require('moleculer').Loggers.Base;
const logger = require('./logger/logger').logger;

class WebRouterLogger extends BaseLogger {
    getLogHandler(bindings) {
        return (type, args) => logger.log(type, ...args);
    }
}


module.exports = {
    nodeID: 'node-web-router',
    logger: [
      {
          type: 'Console',
          options: {
              level: 'info',
          },
      },
      new WebRouterLogger(),
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

    tracing: {
      enabled: true,
      exporter: ['Console'],
    },
    metrics: true,
    serializer: 'JSON',
};
