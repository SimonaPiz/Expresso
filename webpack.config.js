'use strict';

var path = require('path');
const webpack = require('webpack'); // eslint-disable-line no-unused-vars

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: './public/js/bundle.js',
  },
  context: __dirname,
  devtool: 'source-map',
  module: {
    rules: [
      {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env', { targets: "defaults" }],
                    ["@babel/preset-react"]
                ]
            }
          },
      }
    ]
  },
  node: {
    fs: "empty"
  },
  devtool: 'source-map'
};