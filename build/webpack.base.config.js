const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const isDev = !!(process.env.NODE_ENV !== 'production')
const jstsRegex = /\.(js|jsx|ts|tsx)$/
const cssRegex = /\.css$/
const cssModuleRegex = /\.module\.css$/
const lessRegex = /\.less$/
const lessModuleRegex = /\.module\.less$/

function resolve(dir) {
  return path.resolve(__dirname, dir)
}

const cssModuleOptions = (type, useModules) => {
  const options = { importLoaders: type || 1 }
  if (useModules) {
    options.modules = {
      localIdentName: '[path][name]_[hash:base64:5]',
      localIdentContext: resolve(__dirname, '../src'),
      exportLocalsConvention: 'camelCase'
    }
  }
  return options
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'eval-source-map' : 'none',
  entry: {
    app: resolve('../src/main.jsx')
  },
  output: {
    path: resolve('../dist'),
    filename: isDev ? 'js/[name].js' : 'js/[name].[contenthash].js',
    chunkFilename: isDev ? 'js/[name].js' : 'js/[name].[contenthash].js',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@/src': path.resolve(__dirname, '../src/')
    },
  },
  module: {
    rules: [
      {
        test: jstsRegex,
        exclude: '/node_modules/',
        include: resolve('../src'),
        use: [
          { loader: 'babel-loader', options: { cacheDirectory: true }}
        ]
      },
      {
        test: cssRegex,
        exclude: [cssModuleRegex, '/node_modules/'],
        include: resolve('../src'),
        use: ['style-loader', 'css-loader']
      },
      {
        test: cssModuleRegex,
        exclude: '/node_modules/',
        include: resolve('../src'),
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: cssModuleOptions(1, true)
          }
        ]
      },
      {
        test: lessRegex,
        exclude: [lessModuleRegex, '/node_modules/'],
        use: [
          'style-loader', 'css-loader', 'less-loader'
        ],
        sideEffects: true,
      },
      {
        test: lessModuleRegex,
        exclude: '/node_modules/',
        use: [
          'cache-loader',
          'style-loader',
          { loader: 'css-loader', options: cssModuleOptions(2, true) },
          { loader: 'less-loader' },
        ],
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'React Webpack Template',
      template: resolve('../public/index.html'),
      filename: 'index.html',
      inject: 'body',  // script插入body底部
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: resolve('../report/index.html'),
      openAnalyzer: false,
    }),
  ]
}