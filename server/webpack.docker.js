const merge = require('webpack-merge');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  externals: [
    (context, request, callback) => {
      if (request[0] === '.' && request.includes('Config')) {
        return callback(null, `commonjs ${request.replace('../', '')}`);
      }
      return callback();
    },
  ],
  module: {
    rules: [
      {
        test: /index\.m?js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            {
              search: '\/\.\.\/\.\.\/',
              replace: '/../',
              flags: 'g',
            },
            {
              search: '/client/dist',
              replace: '/client',
            },
          ]
        }
      }
    ]
  }
});
