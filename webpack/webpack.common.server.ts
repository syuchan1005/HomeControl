/* eslint-disable import/no-extraneous-dependencies */
import { resolve } from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

const webpackConfig: webpack.Configuration = {
  mode: 'development',
  context: resolve('src/server'),
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
      /*
      {
        enforce: 'pre',
        test: /\.(ts|tsx)?$/,
        loader: 'tslint-loader',
        exclude: [resolve('node_modules')],
      },
      */
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(ts|tsx)?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.server.json',
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
      },
    ],
  },
  plugins: [
    // new HardSourceWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
  ],
  target: 'node',
  externals: [nodeExternals()],
  entry: './index.ts',
  output: {
    filename: 'index.js',
    path: resolve('dist/server'),
  },
  devtool: 'source-map',
};

export default webpackConfig;
