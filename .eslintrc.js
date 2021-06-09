module.exports = {
  extends: ['erb'],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    '@typescript-eslint/no-empty-function': 1, // 空函数警告
    '@typescript-eslint/no-non-null-assertion': 0, // 断言
    '@typescript-eslint/no-unused-vars': 0, // 申明未使用
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-shadow': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/no-empty-interface': 1,
    '@typescript-eslint/naming-convention': 1,
    'import/no-named-as-default': 0,
    'import/no-cycle': 1,
    'import/no-dynamic-require': 0,
    'react/destructuring-assignment': 0,
    'react/button-has-type': 0,
    'react/prop-types': 0,
    'react/display-name': 0,
    'react/no-array-index-key': 1,
    'jsx-a11y/alt-text': 0,
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-console': 0,
    'no-eval': 1,
    'no-nested-ternary': 0,
    'no-else-return': 0,
    'global-require': 0,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
      webpack: {
        config: require.resolve('./.erb/configs/webpack.config.eslint.js'),
      },
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
