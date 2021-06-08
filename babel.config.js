module.exports = {
  // See docs about api at https://babeljs.io/docs/en/config-files#apicache

  presets: [
    // @babel/preset-env will automatically target our browserslist targets
    [require('@babel/preset-env'), { targets: { node: '14.7.0' } }],
    require('@babel/preset-typescript'),
  ],
};
