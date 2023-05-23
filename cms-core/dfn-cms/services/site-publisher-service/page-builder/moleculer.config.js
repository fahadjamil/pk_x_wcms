const BaseLogger = require("moleculer").Loggers.Base
const logger = require("./logger/logger").logger

class WebRouterLogger extends BaseLogger {
  getLogHandler(bindings) {
    return (type, args) => logger.log(type, ...args)
  }
}

module.exports = {
  nodeID: "node-site-publisher",
  logger: [
    {
      type: "Console",
      options: {
        level: "info",
      },
    },
    new WebRouterLogger(),
  ],

  transporter: "Redis",

  tracing: {
    enabled: true,
    exporter: ["Console"],
  },
  metrics: true,
  serializer: "JSON",
}
