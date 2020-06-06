/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';

import webpack from 'webpack';
import merge from 'webpack-merge';
import commonConfig from './webpack.common.client';

const webpackConfig: webpack.Configuration = merge(commonConfig, {
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
    port: 8080,
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
    historyApiFallback: true,
    proxy: {
      '**/*.jpg': 'http://localhost:8081',
      '**/*.webp': 'http://localhost:8081',
      '/graphql': {
        target: 'http://localhost:8081',
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

export default webpackConfig;
