var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/public');
var APP_DIR = path.resolve(__dirname, 'src/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.ProvidePlugin({
      'jQuery' : "jquery"
    })
  ],
  module: {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      },
      {
        test : /\.css$/,
        loader : 'style-loader!css-loader'
      },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=8192' },
      {
        test : /\.json$/,
        loader : 'json-loader'
      }
    ]
  },
  debug: true,
  resolve: {
    moduledirectories: ['node_modules', path.src]
  },
  target: 'electron'
};

module.exports = config;
