/* global process, __dirname */
/* eslint no-process-env: 0, id-match: 0 */
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); // eslint-disable-line no-unused-vars
const CopyWebpackPlugin = require('copy-webpack-plugin');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// I do not know how to build on windows
process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;
// process.env.NODE_ENV = process.env.NODE_ENV || PRODUCTION;

const NODE_ENV = process.env.NODE_ENV;

const IS_DEVELOPMENT = NODE_ENV === DEVELOPMENT;
const IS_PRODUCTION = NODE_ENV === PRODUCTION;

const CWD = __dirname;

const definePluginParams = {
    NODE_ENV: JSON.stringify(NODE_ENV),
    IS_PRODUCTION: JSON.stringify(IS_PRODUCTION),
    IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT)
};

if (IS_PRODUCTION) {
    definePluginParams['process.env'] = {NODE_ENV: JSON.stringify('production')};
}

const webpackConfig = {

    context: path.join(CWD, 'www'),
    entry: {
        // common: './js/common.js',
        main: [
            'babel-polyfill',
            './css/reset.scss',
            './js/index.js'
        ]
    },
    output: Object.assign(
        {filename: '[name].js'},
        IS_PRODUCTION ?
            {path: path.join(CWD, './dist/assets/'), publicPath: '/assets/'} :
            {path: path.join(CWD, './dist/'), publicPath: '/'}
    ),

    watch: IS_DEVELOPMENT,

    devtool: IS_DEVELOPMENT ? 'source-map' : false,

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: ['env', 'stage-1', 'stage-0', 'react', 'flow']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            // {test: /\.(png|jpg|jpeg|gif|svg)$/, loader: 'file-loader?name=img/img-[name]-[hash:6].[ext]'},
            {
                test: /\.(png|jpg|jpeg|gif|svg)(\?[a-z0-9=&.]+)?$/,
                use: IS_DEVELOPMENT ?
                    'base64-inline-loader?limit=2&name=img/img-[name]-[hash:6].[ext]' :
                    'base64-inline-loader?limit=65536&name=img/img-[name]-[hash:6].[ext]'
            },

            // css module
            {
                test: /\.scss$/,
                use: [
                    {loader: 'css-hot-loader'},
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
            },

            // global styles and libraries
            {
                test: /(\.css)$/,
                use: [
                    {loader: 'css-hot-loader'},
                    {loader: 'style-loader', options: {sourceMap: IS_DEVELOPMENT}},
                    {
                        loader: 'css-loader', options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: IS_DEVELOPMENT,
                            localIdentName: '[local]',
                            minimize: IS_PRODUCTION
                        }
                    },
                    {loader: 'resolve-url-loader'},
                    {
                        loader: 'postcss-loader', options: {
                            sourceMap: IS_DEVELOPMENT,
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    },
                    {loader: 'sass-loader', options: {sourceMap: IS_DEVELOPMENT}}
                ]
            },

            {
                test: /\.raw$/,
                loader: 'raw-loader'
            },
            {
                test: /\.(eot|ttf|otf|woff|woff2)$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            }
        ]
    },

    resolve: {
        // alias: {
        //     root: path.resolve(CWD, 'www', 'js'),
        //     mc: path.resolve(CWD, 'www', 'js', 'component', 'main')
        // },
        modules: ['www', 'node_modules'],
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin(definePluginParams),
        new HtmlWebpackPlugin({
            template: 'index.html',
            minify: {
                collapseWhitespace: IS_PRODUCTION,
                removeComments: IS_PRODUCTION,
                minifyCSS: IS_PRODUCTION,
                minifyJS: IS_PRODUCTION
            },
            hash: true,
            filename: IS_PRODUCTION ? './../index.html' : './index.html'
        }),
        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: IS_PRODUCTION ? 'async' : 'defer'
        }),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        })
    ]
};

if (IS_DEVELOPMENT) {
    webpackConfig.plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: (jsModule, count) => {
                const {resource = ''} = jsModule;

                return /node_modules|lib|util|helper|module|\.scss/.test(resource);
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'node-modules',
            minChunks: (jsModule, count) => {
                const {resource = ''} = jsModule;

                return /node_modules|\.scss/.test(resource);
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'style',
            minChunks: (jsModule, count) => {
                const {resource = ''} = jsModule;

                return /\.scss/.test(resource);
            }
        })
    );
}

if (IS_PRODUCTION) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true // eslint-disable-line camelcase
            }
        }),
        new CopyWebpackPlugin([
            // {from: './favicon.ico', to: './../../public/favicon.ico'},
            // {from: './robots.txt', to: './../../public/robots.txt'}
        ], {debug: true})
    );
}

// webpackConfig.plugins.push(new BundleAnalyzerPlugin());

module.exports = webpackConfig;
