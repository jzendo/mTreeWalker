let presetEnv

if (process.env.NODE_ENV === 'test') {
  presetEnv = [
    '@babel/preset-env',
    {
      targets: {
        node: 'current'
      }
    }
  ]
} else {
  presetEnv = ['@babel/env', { modules: false }]
}

module.exports = {
  presets: [
    presetEnv
  ]
}
