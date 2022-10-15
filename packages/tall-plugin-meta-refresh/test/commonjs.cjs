'use strict'

const assert = require('node:assert')
const { metaRefreshPlugin } = require('tall-plugin-meta-refresh')

assert(typeof metaRefreshPlugin === 'function')
console.log('✔︎ CJS')
