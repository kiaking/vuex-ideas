const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()

const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: 'minimal'
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use((req, res, next) => {
  res.redirect('/')
})

module.exports = app.listen(8080, () => {
  console.log(`Server listening on http://localhost:${8080}, Ctrl+C to stop`)
})
