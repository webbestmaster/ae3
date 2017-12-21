/* global process, __dirname */
/* eslint no-process-env: 0, id-match: 0 */
const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        common: './js/common.js',
        main: ['./js/index.js']
    },
    output: Object.assign(
        {filename: '[name].js'},
        // IS_PRODUCTION ?
        //     {path: path.join(CWD, './../public/assets'), publicPath: '/assets/'} :
        {path: path.join(CWD, 'dist')}
    ),

    watch: IS_DEVELOPMENT,

    devtool: IS_DEVELOPMENT ? 'source-map' : false,

    module: {
        rules: [
            // css module
            {
                test: /\.scss$/,
                use: [
                    {loader: 'style-loader', options: {sourceMap: IS_DEVELOPMENT}},
                    {
                        loader: 'css-loader', options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: IS_DEVELOPMENT, // true,
                            localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
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

            // global styles
            {
                test: /_root\.css$/,
                use: [
                    {loader: 'style-loader', options: {sourceMap: IS_DEVELOPMENT}},
                    {
                        loader: 'css-loader', options: {
                            sourceMap: IS_DEVELOPMENT,
                            modules: IS_DEVELOPMENT, // true,
                            localIdentName: '[local]'
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
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: ['env', 'stage-1', 'react', 'flow']
                }
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'file-loader?name=img/img-[name]-[hash:6].[ext]'
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
        new HtmlWebpackPlugin(Object.assign(
            {template: 'index.html'}
            // ,IS_PRODUCTION ? {filename: './../../public/index.html'} : null
        )),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            minChunks: 2
        })
    ]
};

if (IS_PRODUCTION) {
    webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true // eslint-disable-line camelcase
            }
        })
    );
}

module.exports = webpackConfig;
