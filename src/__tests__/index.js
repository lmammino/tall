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

test('it should fail with invalid urls', (done) => {
  tall('this is invalid').catch(e => {
    expect(e.message).toBe('Invalid url: this is invalid')
    done()
  })
})

test('it should return the same url if it\'s not a short url', (done) => {
  tall('https://www.nodejsdesignpatterns.com/').then(url => {
    expect(url).toBe('https://www.nodejsdesignpatterns.com/')
    done()
  })
})
