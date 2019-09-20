const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    output: {
        path: path.resolve(__dirname, '../.tmp'),
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    configFile: './.eslintrc'
                }
            },
        ]
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin({
            filename: '[file].map'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': '"development"'
            }
        }),
        new CleanWebpackPlugin('.tmp', {
            root: path.resolve(__dirname, '..'),
            verbose: true,
            dry: false
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        publicPath: '/',
        contentBase: path.resolve(__dirname, '../.tmp'),
        watchContentBase: true,
        port: 9000
    }
};
