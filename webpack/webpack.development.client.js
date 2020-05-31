/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.client');

module.exports = merge(commonConfig, {
  mode: 'development',
  entry: [
    'react-hot-loader/patch', // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080', // bundle the client for webpack-dev-server and connect to the provided endpoint
    'webpack/hot/only-dev-server', // bundle the client for hot reloading, only- means to only hot reload for successful updates
    './index.tsx', // the entry point of our app
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
  },
  output: {
    publicPath: '/',
  },
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: '8080',
    hot: true,
    watchContentBase: true,
    contentBase: resolve('public'),
    stats: {
      version: false,
      builtAt: false,
      hash: false,
      assets: false,
      entrypoints: false,
      modules: false,
    },
    historyApiFallback: {
      historyApiFallback: true,
    },
    proxy: {
      '**/*.jpg': 'http://localhost:8081',
      '**/*.webp': 'http://localhost:8081',
      '/graphql': {
        target: {
          host: 'localhost',
          port: 8081,
        },
        ws: true,
      },
      '/oauth': 'http://localhost:8081',
      '/google_actions': 'http://localhost:8081',
      '/test': 'http://localhost:8081',
    },
  },
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    namedModules: true,
  },
});
