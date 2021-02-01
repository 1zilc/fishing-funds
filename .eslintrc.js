module.exports = {
  // extends: ['erb/typescript', 'plugin:prettier/recommended'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'react/prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'no-shadow': 1,
    'import/newline-after-import': 0
  }
  // settings: {
  //   'import/resolver': {
  //     // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
  //     node: {},
  //     webpack: {
  //       config: require.resolve('./configs/webpack.config.eslint.js')
  //     }
  //   }
  // }
};
