const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const outputPath = resolve(__dirname, 'playground_dist')

const config = (env = {}) => ({
  mode: env.prod ? 'production' : 'development',
  devtool: env.prod ? 'source-map' : 'inline-source-map',

  devServer: {
    contentBase: outputPath,
    historyApiFallback: true,
    hot: true,
    stats: 'minimal',
  },

  entry: [resolve(__dirname, 'playground/main.ts')],

  output: {
    path: outputPath,
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ],
  },

  resolve: {
    extensions: ['.ts', 'd.ts', '.tsx', '.js', '.vue'],

    alias: {
      vue: '@vue/runtime-dom'
    }
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'playground/index.html')
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!env.prod),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]
})

module.exports = config
