const path = require('path')
const cssnano = require('cssnano')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const BASE_PATH = '..'

const resolvePath = subPath => path.resolve(__dirname, `${BASE_PATH}/${subPath}`)
const baseCSSLoader = sourceMaps => `css?${sourceMaps ? 'sourceMap' : ''}&-minimize`

const createConfig = ({ sourceMaps, extractText }) => ({
  paths: {
    build: resolvePath('build'),
    src: resolvePath('src'),
    styles: resolvePath('src/style'),
    common_module: resolvePath('common_modules'),
    images: resolvePath('src/images'),
  },
  sassLoader: `sass${sourceMaps ? '?sourceMap' : ''}`,
  baseCSSLoader: baseCSSLoader(sourceMaps),
  cssModulesLoader: [
    baseCSSLoader(sourceMaps),
    'modules',
    'importLoaders=1',
    'localIdentName=[name]__[local]___[hash:base64:5]',
  ].join('&'),
  sourceMaps,
  extractText,
})

const createWebpackConfig = (config) => {
  const loaders = [
    // ------------------------------------
    // JS / JSX / Json
    // ------------------------------------
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      include: [config.paths.src, config.paths.common_module],
      loader: 'babel',
      query: {
        cacheDirectory: true,
        plugins: ['transform-runtime'],
        presets: ['es2015', 'react', 'stage-1'],
      },
    },
    {
      test: /\.json$/,
      loader: 'json',
    },
  ]

  // ------------------------------------
  // Styles that should be treated at CSS modules
  // ------------------------------------
  if (config.extractText) {
    loaders.push({
      test: /\.scss$/,
      exclude: config.paths.styles,
      loader: ExtractTextPlugin.extract('style', [config.cssModulesLoader, 'postcss', config.sassLoader]),
    })
  }
 else {
    loaders.push({
      test: /\.scss$/,
      exclude: config.paths.styles,
      loaders: ['style', config.cssModulesLoader, 'postcss', config.sassLoader],
    })
  }

  // ------------------------------------
  // Non CSS Module styles
  // ------------------------------------
  if (config.extractText) {
    loaders.push({
      test: /\.scss$/,
      include: config.paths.styles,
      loader: ExtractTextPlugin.extract('style', [config.baseCSSLoader, 'postcss', config.sassLoader]),
    })
  }
 else {
    loaders.push({
      test: /\.scss$/,
      include: config.paths.styles,
      loaders: ['style', config.baseCSSLoader, 'postcss', config.sassLoader],
    })
  }

  // ------------------------------------
  // File Loaders
  // ------------------------------------
  /* eslint-disable */
  // When not extracting text there is an odd issue where file paths are jacked up to fonts
  // Jacking up the limit to 100k makes them extract as url and the icons load properly
  if (!config.extractText) {
    loaders.push(
      { test: /\.woff(\?.*)?$/,  loader: 'url?name=public/fonts/[name].[ext]&limit=100000&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?name=public/fonts/[name].[ext]&limit=100000&mimetype=application/font-woff2' }
    )
  }
  else {
    loaders.push(
      { test: /\.woff(\?.*)?$/,  loader: 'url?name=public/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff' },
      { test: /\.woff2(\?.*)?$/, loader: 'url?name=public/fonts/[name].[ext]&limit=10000&mimetype=application/font-woff2' }
    )
  }
  loaders.push(
    { test: /\.otf(\?.*)?$/,   loader: 'file?name=public/fonts/[name].[ext]&limit=10000&mimetype=font/opentype' },
    { test: /\.ttf(\?.*)?$/,   loader: 'url?name=public/fonts/[name].[ext]&limit=10000&mimetype=application/octet-stream' },
    { test: /\.eot(\?.*)?$/,   loader: 'file?name=public/fonts/[name].[ext]' },
    { test: /\.svg(\?.*)?$/,   loader: 'url?name=public/fonts/[name].[ext]&limit=10000&mimetype=image/svg+xml' },
    { test: /\.(png|jpg)$/,    loader: 'url?name=public/images/[name].[hash].[ext]&limit=8192', include: config.paths.images }
  )
  /* eslint-enable */

  // ------------------------------------
  // Plugins
  // ------------------------------------
  const plugins = []
  if (config.extractText) {
    plugins.push(new ExtractTextPlugin('public/app.css', {
      allChunks: true,
    }))
  }

  return {
    context: config.paths.src,

    resolve: {
      root: [config.paths.src],
      extensions: ['', '.js', '.jsx', '.json'],
      modulesDirectories: [
        'node_modules',
        'common_modules',
      ],
    },

    postcss: [
      cssnano({
        autoprefixer: {
          add: true,
          remove: true,
          browsers: ['last 2 versions'],
        },
        discardComments: {
          removeAll: !config.sourceMaps, // removing comments breaks the inline source maps
        },
        discardUnused: true,
        mergeIdents: false,
        reduceIdents: false,
        safe: true,
        sourcemap: config.sourceMaps,
      }),
    ],

    output: {
      publicPath: '/',
      path: config.paths.build,
      filename: 'bundle.js',
    },

    module: { loaders },

    sassLoader: {
      includePaths: [config.paths.styles],
    },

    plugins,
  }
}

module.exports = {
  createConfig,
  createWebpackConfig,
  resolvePath,
}
