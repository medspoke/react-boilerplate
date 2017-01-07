const webpack = require('webpack')
const childProcess = require('child_process')
const S3Plugin = require('webpack-s3-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const createConfig = require('./config/webpack.common').createConfig
const createWebpackConfig = require('./config/webpack.common').createWebpackConfig
const resolvePath = require('./config/webpack.common').resolvePath

let env = process.env.NODE_ENV || process.env.RAIL_ENV || 'development'
// Treat deployment env like it is staging to test if build passes
if (env === 'deployment') {
  env = 'staging'
}
/* eslint-disable */
const __DEV__ = env === 'development'
const __PROD__ = env === 'production'
const __STAGE__ = env === 'staging'
const __TEST__ = env === 'testing'
/* eslint-enable */

if (!(__DEV__ || __PROD__ || __STAGE__ || __TEST__)) {
  throw new Error(`Unknown env: ${env}. Exiting build`)
}

console.log(`Loading webpack config for ${env}`)

const config = createConfig({
  sourceMaps: __DEV__,
  extractText: (__PROD__ || __STAGE__),
})
const webpackConfig = createWebpackConfig(config)

webpackConfig.plugins.push(new CopyWebpackPlugin([{
  from: resolvePath('src/index.html'),
  to: resolvePath('build/index.html'),
}]))

if (__DEV__) {
  webpackConfig.devtool = 'source-map'

  webpackConfig.entry = [
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080',
    resolvePath('src/index.js'),
  ]

  webpackConfig.devServer = {
    historyApiFallback: true,
  }

  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'app.version': JSON.stringify(childProcess.execSync('git rev-parse HEAD').toString().substring(0, 6)),
  }))
}

if (__STAGE__ || __PROD__) {
  webpackConfig.entry = [resolvePath('src/index.js')]

  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(env),
    'process.env.API_ROOT_URL': JSON.stringify(`https://${__STAGE__ ? 'staging' : ''}.api.medspoke.tech`),
    // 'app.version': JSON.stringify(childProcess.execSync('git rev-parse HEAD').toString().substring(0, 6))
  }))

  const upperEnv = env.toUpperCase()
  if (process.env[`AWS_REACT_${upperEnv}_ACCESS_KEY_ID`]) {
    webpackConfig.plugins.push(new S3Plugin({
      directory: config.paths.build,
      s3Options: {
        accessKeyId: process.env[`AWS_REACT_${upperEnv}_ACCESS_KEY_ID`],
        secretAccessKey: process.env[`AWS_REACT_${upperEnv}_SECRET_ACCESS_KEY`],
      },
      s3UploadOptions: {
        Bucket: __PROD__ ? 'react-medspoke-production' : 'react-staging',
      },
      cloudfrontInvalidateOptions: {
        DistributionId: process.env[`AWS_REACT_${upperEnv}_CLOUDFRONT_DIST_ID`],
        Items: ['/*'],
      },
    }))
  } else {
    // If the key doesnt exist, we are probably testing the build outside of the actual env
    // That or...something is wrong
    console.warn('Env variable missing: ', `AWS_REACT_${upperEnv}_ACCESS_KEY_ID`)
  }

  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false,
      },
    })
  )
}

module.exports = webpackConfig
