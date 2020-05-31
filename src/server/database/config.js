const debug = require('debug');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: 'development.sqlite',
    logging: debug('db'),
  },
  test: {
    dialect: 'sqlite',
    storage: 'test.sqlite',
  },
  production: {
    dialect: 'sqlite',
    storage: 'production.sqlite',
    logging: debug('bookReader:db'),
  },
};
