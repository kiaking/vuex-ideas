const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const webpack = require('webpack')

const outputPath = resolve(__dirname, '__build__')

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',

  entry: [resolve(__dirname, 'main.ts')],

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
    extensions: ['.js', '.ts', '.js', '.vue'],

    alias: {
      vue: '@vue/runtime-dom',
      vuex: resolve(__dirname, '../src/index.ts')
    }
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html')
    })
  ],

  devServer: {
    contentBase: outputPath,
    historyApiFallback: true,
    hot: true,
    stats: 'minimal',
  }
}
