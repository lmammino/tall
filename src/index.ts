import { request as httpReq, IncomingMessage } from 'node:http'
import { request as httpsReq, RequestOptions } from 'node:https'

export class Follow {
  follow: URL
  constructor (follow: URL) {
    this.follow = follow
  }
}

export class Stop {
  stop: URL
  constructor (stop: URL) {
    this.stop = stop
  }
}

export interface TallPlugin {
  (url: URL, response: IncomingMessage, previous: Follow | Stop): Promise<Follow | Stop>
}

export async function locationHeaderPlugin (url: URL, response: IncomingMessage, previous: Follow | Stop): Promise<Follow | Stop> {
  const { protocol, host } = url

  if (response.headers.location) {
    const followUrl = new URL(response.headers.location.startsWith('http')
      ? response.headers.location
      : `${protocol}//${host}${response.headers.location}`)
    return new Follow(followUrl)
  }

  return previous
}

export interface TallOptions extends RequestOptions {
  maxRedirects: number
  timeout: number,
  plugins: TallPlugin[],
}

const defaultOptions: TallOptions = {
  method: 'GET',
  maxRedirects: 3,
  headers: {},
  timeout: 120000,
  plugins: [locationHeaderPlugin]
}

function makeRequest (url: URL, options: TallOptions): Promise<IncomingMessage> {
  return new Promise((resolve, reject) => {
    const request = url.protocol === 'https:' ? httpsReq : httpReq
    const req = request(url, options as RequestOptions, response => {
      resolve(response)
    })
    req.on('error', reject)
    req.setTimeout(options.timeout, () => req.destroy())
    req.end()
  })
}

export const tall = async (url: string, options?: Partial<TallOptions>): Promise<string> => {
  const opt = Object.assign({}, defaultOptions, options)
  if (opt.maxRedirects <= 0) {
    return url.toString()
  }

  const parsedUrl = new URL(url)
  let prev: Stop | Follow = new Stop(parsedUrl)
  const response = await makeRequest(parsedUrl, opt)
  for (const plugin of opt.plugins) {
    prev = await plugin(parsedUrl, response, prev)
  }

  const maxRedirects = opt.maxRedirects - 1
  if (prev instanceof Follow) {
    return await tall(prev.follow.toString(), { ...options, maxRedirects })
  }

  return prev.stop.toString()
}
