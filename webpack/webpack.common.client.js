/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  context: resolve('src/client'),
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@client': resolve(__dirname, '..', 'src/client'),
      '@server': resolve(__dirname, '..', 'src/server'),
      '@common': resolve(__dirname, '..', 'src/common'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: [resolve('node_modules')],
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          resolve('node_modules'),
          /node_modules\/(?!(swiper|dom7)\/).*/,
          /\.test\.js(x)?$/,
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000',
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader',
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    // inject <script> in html file.
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
    }),
    new CopyWebpackPlugin(
      [
        {
          from: resolve('public'),
          to: resolve('dist/client'),
          ignore: [
            'index.html',
            '.DS_Store',
          ],
        },
      ],
    ),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './src/client/service-worker.js',
      swDest: 'service-worker.js',
      exclude: [
        /\.map$/,
        /icons\//,
        /favicon\.ico$/,
      ],
    }),
  ],
};
