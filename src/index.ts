import { URL } from 'url'
import { request as httpReq } from 'http'
import { request as httpsReq } from 'https'

export type TallAvailableHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface TallHTTPHeaders {
    [header: string]: string
}

export interface TallOptions {
  method?: TallAvailableHTTPMethod
  maxRedirects?: number
  headers?: TallHTTPHeaders
}

const defaultOptions: TallOptions = {
  method: 'GET',
  maxRedirects: 3,
  headers: {}
}

export const tall = (url: string, options?: TallOptions): Promise<string> => {
  const opt = Object.assign({}, defaultOptions, options)
  return new Promise((resolve, reject) => {
    try {
      const { protocol, host, pathname } = new URL(url)

      let [cleanHost, port] = host.split(':', 2)
      if (typeof port === 'undefined') {
        // if no port is specified set the port based on protocol
        port = protocol === 'https:' ? '443' : '80'
      }

      const method = opt.method
      const request = protocol === 'https:' ? httpsReq : httpReq
      const headers = opt.headers
      return request({ method, protocol, host: cleanHost, port: port, path: pathname, headers }, response => {
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
        .on('error', reject)
        .end()
    } catch (err) {
      return reject(err)
    }
  })
}

export default tall
