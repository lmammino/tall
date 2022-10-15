import assert from 'node:assert'
import { metaRefreshPlugin } from 'tall-plugin-meta-refresh'

assert(typeof metaRefreshPlugin === 'function')
console.log('✔︎ ESM')
