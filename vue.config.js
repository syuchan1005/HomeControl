/* eslint-disable no-param-reassign,import/no-dynamic-require,global-require,prefer-template */

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  devServer: {
    port: 8081,
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        /* https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/27 */
        languages: ['javascript', 'typescript'],
      }),
    ],
  },
  pluginOptions: {
    apollo: {
      enableEngine: false,
    },
  },
};
