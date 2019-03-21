/* global test expect */

import { tall } from '../'

test('it should unshorten custom domain url links', () => {
  tall('http://www.loige.link/codemotion-rome-2017').then(url =>
    expect(url).toBe(
      'https://slides.com/lucianomammino/universal-js-web-applications-with-react-codemotion-rome-2017'
    )
  )
})

test('it should unshorten bit.ly links', () => {
  tall('http://bit.ly/judo-heroes-tutorial').then(url =>
    expect(url).toBe(
      'https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app'
    )
  )
})

test('it should fail with invalid urls', () => {
  tall('this is invalid').catch(e =>
    expect(e.message).toBe('Invalid url: this is invalid')
  )
})

test("it should return the same url if it's not a short url", () => {
  tall('https://www.nodejsdesignpatterns.com/').then(url =>
    expect(url).toBe('https://www.nodejsdesignpatterns.com/')
  )
})

test('it should unshorten medium links / set User-Agent header', async () => {
  const url = await tall('https://link.medium.com/yNuAPxmdNR', { maxRedirects: 4, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36' } })
  expect(url).toMatch(/^https:\/\/hackernoon.com\/everything-i-knew-about-reading-was-wrong-bde7e57fbfdc/)
})
