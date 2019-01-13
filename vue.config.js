/* eslint-disable no-param-reassign,import/no-dynamic-require,global-require,prefer-template */

module.exports = {
  chainWebpack: (config) => {
    config.module.rule('gql');
    config.plugin('define')
      .tap((defs) => {
        const prefix = 'Config.';
        const flatConfig = Object.entries(require('flat')(require(require('path').join(__dirname, 'Config.js')), {
          safe: true,
        })).reduce((c, entry) => {
          c[prefix + entry[0]] = JSON.stringify(entry[1]);
          return c;
        }, {});
        defs[0] = Object.assign(defs[0], flatConfig);
        return defs;
      });
  },
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: false,
    },
  },
};
