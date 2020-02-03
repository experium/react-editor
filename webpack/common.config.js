const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './demo/app.js',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'],
                    plugins: [
                        '@babel/plugin-proposal-class-properties',
                        ['import', { 'libraryName': 'antd', 'style': 'css' }]
                    ],
                    babelrc: false
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.s[ac]ss$/,
                use: [
                    (process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader'),
                    { loader: 'css-loader', options: {
                        modules: true,
                        importLoaders: 2,
                        modules: {
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }},
                    'sass-loader'
                ]
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'assets/fonts/[name].[ext]'
                }
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]'
                }
            },
            {
                test: /\.(jpe?g|png|gif|ico)$/,
                loader: 'url-loader',
                options: {
                    name: 'assets/fonts/[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.json', '.jsx', '.css', '.scss']
    },
    plugins: [
        new CopyWebpackPlugin([
            {
                from: 'demo/index.html',
                to: 'index.html'
            },
            {
                from: 'src/ru.js',
                to: 'translations'
            }
        ])
    ]
}
