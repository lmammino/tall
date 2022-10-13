'use strict'

const assert = require('assert')
const { metaRefreshPlugin } = require('tall-plugin-meta-refresh')

assert(typeof metaRefreshPlugin === 'function')
console.log('✔︎ CJS')
