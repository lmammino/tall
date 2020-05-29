export type TallAvailableHTTPMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'

export interface TallHTTPHeaders {
    [header: string]: string
}

/**
 * @property {TallAvailableHTTPMethod} method Any available HTTP method. (default "GET")
 * @property {number} maxRedirects The number of maximum redirects that will be followed in case of multiple redirects. (default 3)
 * @property {TallHTTPHeaders} headers Change request headers.
 */
export interface TallOptions {
    method?: TallAvailableHTTPMethod
    maxRedirects?: number
    headers?: TallHTTPHeaders
}

/**
 * URL expander
 */
declare function tall(urlToExpand: string, options?: TallOptions): Promise<string>;

export default tall
