/* eslint-disable import/no-extraneous-dependencies */
const { resolve } = require('path');

module.exports = {
  context: resolve('src'),
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias: {
      '@client': resolve(__dirname, '..', 'src/client'),
      '@server': resolve(__dirname, '..', 'src/server'),
      '@common': resolve(__dirname, '..', 'src/common'),
    },
  },
};
