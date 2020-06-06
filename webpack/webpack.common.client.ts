/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import { resolve } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WorkboxWebpackPlugin from 'workbox-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';
import YAML from 'yaml';

const config = YAML.parse(fs.readFileSync('config.yaml', 'utf8'));

const webpackConfig: webpack.Configuration = {
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
    // new HardSourceWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new webpack.EnvironmentPlugin(Object.keys(config).reduce((obj, key) => {
      // eslint-disable-next-line no-param-reassign
      obj[key.toUpperCase()] = JSON.stringify(config[key]);
      return obj;
    }, {})),
    // inject <script> in html file.
    new MiniCssExtractPlugin({
      filename: 'style.css',
      chunkFilename: '[id].css',
    }),
    new HtmlWebpackPlugin({
      template: resolve('public/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('public'),
          to: resolve('dist/client'),
          globOptions: {
            ignore: [
              'index.html',
              '.DS_Store',
            ],
          },
        },
      ],
    }),
    new WorkboxWebpackPlugin.InjectManifest({
      swSrc: './service-worker.js',
      swDest: 'service-worker.js',
      exclude: [
        /\.map$/,
        /icons\//,
        /favicon\.ico$/,
      ],
    }),
  ],
};

export default webpackConfig;
