/* eslint consistent-return: "off"*/

import { parse } from 'url';
import { request } from 'http';

export const tall = url => new Promise((resolve, reject) => {
  const { protocol, host, path } = parse(url);
  if (!protocol || !host || !path) {
    return reject(new Error(`Invalid url: ${url}`));
  }

  const method = 'GET';
  return request(
    { method, protocol, host, path }, response => resolve(response.headers.location || url),
  ).end();
});

export default tall;
