const merge = require('webpack-merge');
const base = require('./webpack.base.js');

module.exports = merge(base, {
  externals: [
    (context, request, callback) => {
      if (request[0] === '.' && request.includes('Config')) {
        return callback(null, `commonjs ${request}`);
      }
      return callback();
    },
  ],
});
