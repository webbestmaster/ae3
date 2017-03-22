'use strict';

// const SERVER_URL = 'https://statlex.github.io/app/cr/';

const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const Autoprefixer = require('autoprefixer');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const IS_MOBILE = false;

const CWD = __dirname;

const webpackConfig = {

    context: path.join(CWD, 'www'),
    entry: {
        'common': './common',
        'main': ['./app.jsx']
    },
    output: {
        path: path.join(CWD, 'dist'),
        filename: '[name].js'
    },

    watch: NODE_ENV === DEVELOPMENT,

    devtool: NODE_ENV === DEVELOPMENT ? 'source-map' : null,
    // devtool: null,

    postcss: [Autoprefixer({
        browsers: IS_MOBILE ? [
                'last 2 Samsung versions',
                'last 2 UCAndroid versions',
                'Android >= 4',
                'iOS >= 8',
                'ChromeAndroid > 4'
            ] : [
                'last 5 Chrome versions',
                'last 2 Safari versions',
                'last 2 Edge versions',
                'Explorer >= 10',
                'last 5 Firefox versions'
            ]
    })],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/,
                query: {
                    presets: ['es2015', 'stage-1', 'react'],
                    compact: false
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader?name=img/img-[name]-[hash:6].[ext]'
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!postcss!sass')
            },
            {
                test: /\.raw$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(eot|ttf|otf|woff|woff2)$/,
                loader: 'file?name=fonts/[name].[ext]'
            }
        ]
    },

    resolve: {
        modulesDirectories: ['', 'www', 'node_modules'],
        extensions: ['', '.js', '.jsx']
    },

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        })
    ]

};

if (NODE_ENV === PRODUCTION) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            }
        })
    );
}

module.exports = webpackConfig;
