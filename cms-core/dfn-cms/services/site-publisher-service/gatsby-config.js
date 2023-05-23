// const fs = require('fs');

// Gatsby settings for the environment variables
const { GOOGLE_ANALYTICS_TRACKING_ID } = require('./config/config');

// let GOOGLE_ANALYTICS_TRACKING_ID = '';

// getTrackingId();

// // get google tracking ID for relavent DB
// function getTrackingId() {
//     const GA_TRACKING_IDS = JSON.parse(GOOGLE_ANALYTICS_TRACKING_IDS);
//     const paramsText = fs.readFileSync('db_name.txt', 'utf8');
//     const paramsData = JSON.parse(paramsText);

//     dataBaseName = paramsData.dbName;
//     GOOGLE_ANALYTICS_TRACKING_ID = GA_TRACKING_IDS[dataBaseName];
// }

module.exports = {
    siteMetadata: {
        title: `Gatsby Default Starter`,
        description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
        author: `@gatsbyjs`,
        siteUrl: `https://www.dfncms.org`,
    },
    plugins: [
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                // The property ID; the tracking code won't be generated without it
                trackingId: GOOGLE_ANALYTICS_TRACKING_ID,
                // Defines where to place the tracking script - `true` in the head and `false` in the body
                head: true,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/logo.png`, // This path is relative to the root of the site.
                cache_busting_mode: 'none',
            },
        },
        {
            resolve: `gatsby-plugin-remove-serviceworker`,
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/blog`,
                name: `blog`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/assets`,
                name: `assets`,
            },
        },
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/content/data`,
                name: `data`,
            },
        },
        `gatsby-transformer-remark`,
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-sitemap`,
        `gatsby-plugin-webpack-bundle-analyser-v2`,
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
    ],
    proxy: {
        prefix: '/api',
        url: 'http://localhost:3200',
    },
};
