/* global process, __dirname */
/* eslint no-process-env: 0, id-match: 0 */
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const IS_DEVELOPMENT = NODE_ENV === DEVELOPMENT;
const IS_PRODUCTION = NODE_ENV === PRODUCTION;

const CWD = __dirname;

const definePluginParams = {
    // NODE_ENV: JSON.stringify(NODE_ENV),
    IS_PRODUCTION: JSON.stringify(IS_PRODUCTION)
    // IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT)
};

const fileRETest = /\.(png|jpg|jpeg|gif|svg)(\?[a-z0-9=&.]+)?$/;

const webpackConfig = {
    entry: [
        'babel-polyfill',
        'whatwg-fetch',
        './www/css/root.scss',
        './www/js/index.js'
    ],
    output: {
        path: path.join(CWD, '/dist'),
        publicPath: '/'
    },

    devtool: IS_PRODUCTION ? false : 'source-map',

    optimization: Object.assign(
        {},
        IS_DEVELOPMENT ?
            {
                splitChunks: {
                    cacheGroups: {
                        main: {
                            chunks: 'initial',
                            name: 'main',
                            priority: -25,
                            reuseExistingChunk: true
                        },
                        style: {
                            chunks: 'initial',
                            name: 'style',
                            priority: -20,
                            reuseExistingChunk: true,
                            test: /\.scss$/
                        },
                        file: {
                            chunks: 'initial',
                            name: 'file',
                            priority: -15,
                            test: fileRETest
                        },
                        vendor: {
                            chunks: 'initial',
                            name: 'vendor',
                            priority: -10,
                            test: /node_modules/
                        }
                    }
                }
            } :
            null
    ),
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /node_modules/,
                // query-string: query-string|strict-uri-encode
                // pixi-viewport: pixi-viewport|yy-[\w]+
                exclude: /node_modules(?!(\/|\\)(query-string|strict-uri-encode|pixi-viewport|yy-[\w]+))/,
                loader: 'babel-loader'
            },
            {
                test: fileRETest,
                use: {
                    loader: 'base64-inline-loader',
                    // - limit - The limit can be specified with a query parameter. (Defaults to no limit).
                    // If the file is greater than the limit (in bytes) the file-loader is used and
                    // all query parameters are passed to it.
                    // - name - The name is a standard option.
                    query: IS_DEVELOPMENT ?
                        {
                            limit: 10e3, // 10k bytes
                            name: 'img/img-[name]-[hash:6].[ext]'
                        } :
                        {
                            limit: 10e3, // 10k bytes
                            name: 'img/img-[name]-[hash:6].[ext]'
                        }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader', options: {sourceMap: IS_DEVELOPMENT}},
                    {
                        loader: 'css-loader', options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: true,
                            localIdentName: '[local]----[path]--[name]--[hash:base64:5]',
                            minimize: IS_PRODUCTION
                        }
                    },
                    {
                        loader: 'postcss-loader', options: {
                            sourceMap: true,
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    },
                    {loader: 'sass-loader', options: {sourceMap: IS_DEVELOPMENT}}
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['./dist']),
        new webpack.DefinePlugin(definePluginParams),
        new HtmlWebpackPlugin({
            template: './www/index.html',
            minify: {
                collapseWhitespace: IS_PRODUCTION,
                removeComments: IS_PRODUCTION,
                minifyCSS: IS_PRODUCTION,
                minifyJS: IS_PRODUCTION
            },
            hash: true
            // filename: IS_PRODUCTION ? './../index.html' : './index.html'
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: IS_PRODUCTION ? 'async' : 'defer'
        }),
        new CopyWebpackPlugin([{from: './www/favicon.ico', to: './favicon.ico'}], {debug: 'info'}),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/)
    ]
};

// webpackConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = webpackConfig;
