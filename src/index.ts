import { URL } from 'url'
import { request as httpReq } from 'http'
import { request as httpsReq } from 'https'

export type TallAvailableHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface TallHTTPHeaders {
    [header: string]: string
}

export interface TallOptions {
  method: TallAvailableHTTPMethod
  maxRedirects: number
  headers: TallHTTPHeaders
  timeout: number
}

const defaultOptions: TallOptions = {
  method: 'GET',
  maxRedirects: 3,
  headers: {},
  timeout: 120000
}

export const tall = (url: string, options?: Partial<TallOptions>): Promise<string> => {
  const opt = Object.assign({}, defaultOptions, options)
  return new Promise((resolve, reject) => {
    try {
      const { protocol, host } = new URL(url)

      let [, port] = host.split(':', 2)
      if (typeof port === 'undefined') {
        // if no port is specified set the port based on protocol
        port = protocol === 'https:' ? '443' : '80'
      }

      const method = opt.method
      const request = protocol === 'https:' ? httpsReq : httpReq
      const headers = opt.headers
      const req = request(url, { method, headers }, response => {
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
      })
      req.on('error', reject)
      req.setTimeout(opt.timeout, () => req.destroy())
      req.end()
      return req
    } catch (err) {
      return reject(err)
    }
  })
}
