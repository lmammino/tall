export type TallAvailableHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface TallHTTPHeaders {
    [header: string]: string
}

/**
 * @property {AvailableHTTPMethod} method Any available HTTP method. (default "GET")
 * @property {number} maxRedirects The number of maximum redirects that will be followed in case of multiple redirects. (default 3)
 * @property {HTTPHeaders} headers Change request headers.
 */
export interface TallOptions {
    method?: AvailableHTTPMethod
    maxRedirects?: number
    headers?: HTTPHeaders
}

/**
 * URL expander
 */
declare function tall(urlToExpand: string, options?: Options): Promise<string>;

export default tall
