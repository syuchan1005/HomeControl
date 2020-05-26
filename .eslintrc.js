const path = require('path');

module.exports = {
  extends: 'airbnb',
  plugins: [
    '@typescript-eslint',
    'import',
    'react',
    'react-hooks',
    'jsx-a11y',
    'graphql',
  ],
  env: {
    browser: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    // project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignorePatterns: ['src/common/GQLTypes.ts'],
  rules: {
    'no-unused-vars': 'off',
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    'react/jsx-no-target-blank': 'error',
    'react/jsx-filename-extension': [1, { "extensions": [".tsx", ".jsx"] }],
    'react/jsx-props-no-spreading': 0,
    'import/extensions': ['error', 'ignorePackages', {
      'js': 'never',
      'jsx': 'never',
      'ts': 'never',
      'tsx': 'never',
    }]
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs'],
      },
      webpack: {
        config: path.join(__dirname, 'webpack/webpack.common.client.js'),
      },
    },
  },
};
