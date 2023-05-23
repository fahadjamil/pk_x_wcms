module.exports = {
    logger: true,
    logLevel: 'debug',
    transporter: 'redis://redis-service',

    tracing: {
        enabled: true,
        exporter: ['Console'],
    },

    metrics: true,
    serializer: 'JSON',
};
