/* eslint consistent-return: "off"*/

import { parse } from 'url';
import { request as httpReq } from 'http';
import { request as httpsReq } from 'https';

export const tall = url => new Promise((resolve, reject) => {
  const { protocol, host, path } = parse(url);
  if (!protocol || !host || !path) {
    return reject(new Error(`Invalid url: ${url}`));
  }

  const method = 'GET';
  const request = protocol === 'https:' ? httpsReq : httpReq;
  return request(
    { method, protocol, host, path }, response => resolve(response.headers.location || url),
  ).end();
});

export default tall;
