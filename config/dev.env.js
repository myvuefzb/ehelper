'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_CONFIG: '"dev"',
  BASE_API: '"http://10.31.1.2:93"',
  OTHER_API:'"http://10.31.1.2:85"',
})
