module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', { useBuiltIns: 'entry', corejs: '3.32.0' }],
    ],
  };
};
