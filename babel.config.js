module.exports = function (api) {
  api.cache.forever()

  return {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.js', '.ts', '.tsx', 'json'],
        },
      ],
    ],
  }
}
