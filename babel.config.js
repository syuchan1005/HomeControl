module.exports = {
  env: {
    vue: {
      presets: [
        '@vue/app',
      ],
    },
    node: {
      presets: [
        [
          '@babel/preset-env', { targets: { node: 'current' } },
        ],
      ],
    },
    test: {
      presets: [
        [
          '@babel/preset-env', { targets: { node: 'current' } },
        ],
      ],
    },
  },
};
