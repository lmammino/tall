/* global test expect */

import { tall } from '../'

test('it should unshorten custom domain url links', (done) => {
  tall('http://www.loige.link/codemotion-rome-2017').then(url => {
    expect(url).toBe(
      'https://slides.com/lucianomammino/universal-js-web-applications-with-react-codemotion-rome-2017'
    )
    done()
  })
})

test('it should unshorten bit.ly links', (done) => {
  tall('http://bit.ly/judo-heroes-tutorial').then(url => {
    expect(url).toBe(
      'https://scotch.io/tutorials/react-on-the-server-for-beginners-build-a-universal-react-and-node-app'
    )
    done()
  })
})

test('it should unshorten links that point to a non standard port', (done) => {
  tall('https://loige.link/aqj').then(url => {
    expect(url).toBe(
      'http://portquiz.net:8080/'
    )
    done()
  })
    .catch((err) => {
      console.error(err)
      done(err)
    })
})

test('it should fail with invalid urls', (done) => {
  tall('this is invalid').catch(e => {
    expect(e.message).toBe('Invalid URL: this is invalid')
    done()
  })
})

test('it should return the same url if it\'s not a short url', (done) => {
  tall('https://www.nodejsdesignpatterns.com/').then(url => {
    expect(url).toBe('https://www.nodejsdesignpatterns.com/')
    done()
  })
})

test('it should unshorten medium links / set User-Agent header', (done) => {
  tall('https://link.medium.com/yNuAPxmdNR', {
    maxRedirects: 4,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    }
  }).then(url => {
    expect(url).toMatch(/^https:\/\/hackernoon.com\/everything-i-knew-about-reading-was-wrong-bde7e57fbfdc/)
    done()
  })
})

test('it should not fail with location without hostname', async () => {
  const url = await tall('https://www.bustle.com/p/the-best-strategy-board-games-for-adults-15561360')
  expect(url).toBe('https://www.bustle.com/p/the-10-best-strategy-board-games-for-adults-15561360')
})
