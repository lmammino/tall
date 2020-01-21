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
    try {
      const { protocol, host, path } = parse(url)
      if (!protocol || !host || !path) {
        return reject(new Error(`Invalid url: ${url}`))
      }

      let [cleanHost, port] = host.split(':', 2)
      if (typeof port === 'undefined') {
        port = protocol === 'https:' ? 443 : 80
      }

      const method = opt.method
      const request = protocol === 'https:' ? httpsReq : httpReq
      const headers = opt.headers
      return request({ method, protocol, host: cleanHost, port, path, headers }, response => {
        if (response.headers.location && opt.maxRedirects) {
          opt.maxRedirects--
          return resolve(
            tall(response.headers.location.startsWith('http')
              ? response.headers.location
              : `${protocol}//${host}${response.headers.location}`, opt
            )
          )
        }

        resolve(url)
      }).on('error', function (err) {
        return reject(err)
      }).end()
    } catch (err) {
      return reject(err)
    }
  })
}

export default tall
