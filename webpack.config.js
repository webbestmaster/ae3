const path = require('path');

const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

const NODE_ENV = process.env.NODE_ENV;

const IS_DEVELOPMENT = NODE_ENV === DEVELOPMENT;
const IS_PRODUCTION = !IS_DEVELOPMENT;

const CWD = __dirname;

const IS_MOBILE = false;

const autoprefixerOptions = {
    browsers: IS_MOBILE ? [
        'last 2 Samsung versions',
        'last 2 UCAndroid versions',
        'Android >= 4',
        'iOS >= 8',
        'ChromeAndroid > 4'
    ] : [
        'Chrome 20',
        'Safari 5',
        'Edge 12',
        'Explorer 8',
        'Firefox 15'
    ]
};

const styleLoaders = ['css-loader', 'autoprefixer-loader?' + JSON.stringify(autoprefixerOptions), 'sass-loader'];

const webpackConfig = {

    context: path.join(CWD, 'www'),
    entry: {
        'common': './js/common.js',
        'main': ['./js/app.js']
    },
    output: {
        path: path.join(CWD, 'dist'),
        filename: '[name].js'
    },

    watch: IS_DEVELOPMENT,

    devtool: IS_DEVELOPMENT ? 'source-map' : null,

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/,
                options: {
                    presets: ['es2015', 'stage-1', 'react']
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
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    loader: 'css-loader?importLoaders=' + (styleLoaders.length - 1)
                })
            },
            {
                test: /\.(sass|scss)$/,
                loader: ExtractTextPlugin.extract(styleLoaders)
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
        alias: {
            // root: path.resolve(CWD, 'www', 'js'),
            // mc: path.resolve(CWD, 'www', 'js', 'component', 'main')
        },
        modules: ['www', 'node_modules'],
        extensions: ['.js', '.jsx']
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: 'index.html'
        }),
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
                drop_console: true
            }
        })
    );
}

module.exports = webpackConfig;
