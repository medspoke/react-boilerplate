const createConfig = require('../config/webpack.common').createConfig
const createWebpackConfig = require('../config/webpack.common').createWebpackConfig

const config = createConfig({ sourceMaps: true })
const webpackConfig = createWebpackConfig(config)

module.exports = webpackConfig
