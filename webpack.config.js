const merge = require('webpack-merge');
const common = require('./webpack/common.config');

const NODE_ENV = process.env.NODE_ENV || 'dev';

const config = require(`./webpack/${NODE_ENV}.config`);

module.exports = merge.smart(config, common);
