const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: '../src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'gatsby-build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                    },
                },
            },
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        react: 'commonjs react',
        'styled-components': 'styled-components',
        axios: 'axios',
        uuid: 'uuid',
        'react-bootstrap': 'react-bootstrap',
        'react-lazy-load-image-component': 'react-lazy-load-image-component',
        'universal-cookie/es6': 'universal-cookie/es6',
        exceljs: 'exceljs',
        'react-scroll-up-button': 'react-scroll-up-button',
        jspdf: 'jspdf',
        'jspdf-autotable': 'jspdf-autotable',
        'react-router-dom': 'react-router-dom',
        'gatsby-plugin-google-analytics': 'gatsby-plugin-google-analytics',
        'react-multi-select-component': 'react-multi-select-component',
        'react-player': 'react-player',
        '@ckeditor/ckeditor5-react': '@ckeditor/ckeditor5-react',
        'react-datepicker': 'react-datepicker',
        'fastest-validator': 'fastest-validator',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: './package.json',
                    to: './',
                },
            ],
        }),
    ],
};
