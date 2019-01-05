module.exports = {
  chainWebpack: (config) => {
    config.module.rule('gql');
  },
  pluginOptions: {
    apollo: {
      enableMocks: true,
      enableEngine: false,
    },
  },
};
