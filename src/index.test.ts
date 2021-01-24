import nock from 'nock'
import { tall } from '.'

beforeEach(() => {
  nock.cleanAll()
})

test('it should unshorten a link using https', async () => {
  nock('https://example.com')
    .get('/a-link')
    .times(1)
    .reply(301, 'Moved', { location: 'https://dest.pizza/a-link' })
  nock('https://dest.pizza')
    .get('/a-link')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('https://example.com/a-link')

  expect(url).toBe('https://dest.pizza/a-link')
})

test('it should unshorten a link using http', async () => {
  nock('http://example.com')
    .get('/a-link')
    .times(1)
    .reply(301, 'Moved', { location: 'http://dest.pizza/a-link' })
  nock('http://dest.pizza')
    .get('/a-link')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('http://example.com/a-link')

  expect(url).toBe('http://dest.pizza/a-link')
})

// test('it should unshorten links that point to a non standard port', async () => {
//   const scope = nock('https://source2.link')
//     .get('/a-link')
//     .reply(301, 'Moved', { location: 'http://destination.link:8080/a-link' })

//   console.log('-------> PRE')
//   const url = await tall('https://source2.link/a-link')
//   console.log('-------> POST')

//   expect(url).toBe('http://destination.link:8080/a-link')
//   expect(scope.isDone).toBeTruthy()
// })

// tap.test('it should fail with invalid urls', async () => {
//   try {
//     await tall('this is invalid')
//   } catch (e) {
//     tap.equal(e.message, 'Invalid URL: this is invalid')
//   }
// })

// tap.test('it should return the same url if it\'s not a short url', async () => {
//   const url = await tall('https://www.nodejsdesignpatterns.com/')
//   tap.equal(url, 'https://www.nodejsdesignpatterns.com/')
// })

// tap.test('it should unshorten medium links / set User-Agent header', async () => {
//   const url = await tall('https://link.medium.com/yNuAPxmdNR', {
//     maxRedirects: 4,
//     headers: {
//       'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
//     }
//   })
//   tap.match(url, /^https:\/\/hackernoon.com\/everything-i-knew-about-reading-was-wrong-bde7e57fbfdc/)
// })

// tap.test('it should not fail with location without hostname', async () => {
//   const url = await tall('https://www.bustle.com/p/the-best-strategy-board-games-for-adults-15561360')
//   tap.equal(url, 'https://www.bustle.com/p/the-10-best-strategy-board-games-for-adults-15561360')
// })
