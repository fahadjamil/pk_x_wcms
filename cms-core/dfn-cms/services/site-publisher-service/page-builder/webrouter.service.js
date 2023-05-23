const logger = require("../logger/logger").logger
const errorHandlerService = require("error-handler").errorHandler(logger)

module.exports = {
  name: "cms.site-publisher",
  server: null,
  hooks: {
    error: {
      // Global error handler
      "*": function(ctx, err) {
        const error = errorHandlerService.errorHandler(err)
      },
    },
  },
  actions: {
    async releaseBuild(ctx) {
      console.log(
        "-------------cms.site-publisher.releaseBuild----------------"
      )
      const data = await this.releaseBuild(ctx)
      return JSON.stringify(data)
    },
  },
  methods: {
    async releaseBuild(req, res, next) {
      console.log("IN SIDE SITE PUBLISHER ")
    },
  },
  async started() {
    logger.log("info", `SERVICE - ${this.name} - Started -----------------`)
  },

  async stopped() {
    logger.log("info", `SERVICE - ${this.name} stopped -----------------`)
  },
}
