const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/index.js',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
        libraryTarget: 'commonjs2',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'src'),
                exclude: /(node_modules|bower_components|build)/,
                use: {
                    loader: 'babel-loader?cacheDirectory',
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
    optimization: { minimize: true },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    externals: {
        react: 'commonjs react',
        'styled-components': 'styled-components',
        axios: 'axios',
        uuid: 'uuid',
        'react-bootstrap': 'react-bootstrap',
        exceljs: 'exceljs',
        jspdf: 'jspdf',
        'jspdf-autotable': 'jspdf-autotable',
        // antd: 'antd',
        // 'html2canvas': 'html2canvas',
        // 'dompurify': 'dompurify',
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
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en|ar/),
        // new BundleAnalyzerPlugin(),
    ],
};
