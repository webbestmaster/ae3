/* global process, __dirname */
/* eslint no-process-env: 0, id-match: 0 */
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const NODE_ENV = process.env.NODE_ENV;

const IS_DEVELOPMENT = NODE_ENV === DEVELOPMENT;
const IS_PRODUCTION = NODE_ENV === PRODUCTION;

const CWD = __dirname;

const definePluginParams = {
    NODE_ENV: JSON.stringify(NODE_ENV),
    IS_PRODUCTION: JSON.stringify(IS_PRODUCTION),
    IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT)
};

const webpackConfig = {
    entry: [
        'babel-polyfill',
        './www/css/root.scss',
        './www/js/index.js'
    ],
    output: {
        path: path.join(CWD, '/dist')
        // filename: '[name].js'
    },

    devtool: IS_DEVELOPMENT ? 'source-map' : false,

    optimization: Object.assign(
        {},
        IS_DEVELOPMENT ?
            {
                splitChunks: {
                    cacheGroups: {
                        main: {
                            chunks: 'initial',
                            name: 'main',
                            priority: -20,
                            reuseExistingChunk: true
                        },
                        style: {
                            chunks: 'initial',
                            name: 'style',
                            priority: -15,
                            reuseExistingChunk: true,
                            test: /\.scss$/
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
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'stage-1', 'stage-0', 'react', 'flow']
                    }
                }
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)(\?[a-z0-9=&.]+)?$/,
                use: {
                    loader: 'base64-inline-loader',
                    // - limit - The limit can be specified with a query parameter. (Defaults to no limit).
                    // If the file is greater than the limit (in bytes) the file-loader is used and
                    // all query parameters are passed to it.
                    // - name - The name is a standard option.
                    query: IS_DEVELOPMENT ?
                        {
                            limit: 0,
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
                    {loader: 'resolve-url-loader'},
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
        new webpack.DefinePlugin(definePluginParams),
        new HtmlWebpackPlugin({
            template: './www/index.html'
        })
    ]
};

// webpackConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = webpackConfig;
