/* eslint consistent-return: "off" */

import { parse } from 'url'
import { request as httpReq } from 'http'
import { request as httpsReq } from 'https'

const defaultOptions = {
  method: 'GET',
  maxRedirects: 3,
  headers: {}
}

export const tall = (url, options) => {
  const opt = Object.assign({}, defaultOptions, options)
  return new Promise((resolve, reject) => {
    const { protocol, host, path } = parse(url)
    if (!protocol || !host || !path) {
      return reject(new Error(`Invalid url: ${url}`))
    }

    const method = opt.method
    const request = protocol === 'https:' ? httpsReq : httpReq
    const headers = opt.headers
    return request({ method, protocol, host, path, headers }, response => {
      if (response.headers.location && opt.maxRedirects) {
        opt.maxRedirects--
        return resolve(tall(response.headers.location,opt))
      }

      resolve(url)
    }).end()
  })
}

export default tall
