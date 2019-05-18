/* eslint-disable no-param-reassign,import/no-dynamic-require,global-require,prefer-template */

const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  devServer: {
    compress: true,
    port: 8081,
    disableHostCheck: true,
    public: 'localhost:8081',
    proxy: 'http://localhost:8080',
  },
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        /* https://github.com/Microsoft/monaco-editor-webpack-plugin/issues/27 */
        languages: ['javascript', 'typescript'],
      }),
    ],
  },
};
