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

test('it should not fail with location without hostname', async () => {
  const url = await tall('https://www.bustle.com/p/the-best-strategy-board-games-for-adults-15561360')
  expect(url).toBe('https://www.bustle.com/p/the-10-best-strategy-board-games-for-adults-15561360')
})
