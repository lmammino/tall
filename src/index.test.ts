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

test('it should fail if an invalid URL is given', async () => {
  await expect(() => tall('this is not a URL')).rejects.toMatchObject({ message: 'Invalid URL: this is not a URL' })
})

test('it should fail if a URL without protocol is given', async () => {
  await expect(() => tall('example.com')).rejects.toMatchObject({ message: 'Invalid URL: example.com' })
})

test('it should return the original url if no redirect', async () => {
  nock('https://example.com')
    .get('/test')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('https://example.com/test')

  expect(url).toBe('https://example.com/test')
})

test('it should follow redirects with relative path', async () => {
  nock('https://example.com')
    .get('/test')
    .times(1)
    .reply(301, 'Moved', { location: '/test2' })
    .get('/test2')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('https://example.com/test')

  expect(url).toBe('https://example.com/test2')
})

test('it should respect the maxRedirects option', async () => {
  nock('https://example.com')
    .get('/go1')
    .times(1)
    .reply(301, 'Moved', { location: 'https://example.com/go2' }) // first redirect
    .get('/go2')
    .times(1)
    .reply(301, 'Moved', { location: 'https://example.com/go3' }) // second redirect <-- should stop here with maxRedirects = 2
    .get('/go3')
    .times(1)
    .reply(301, 'Moved', { location: 'https://example.com/go4' }) // third redirect
    .get('/go4')
    .times(1)
    .reply(301, 'Moved', { location: 'https://example.com/final' }) // fourth redirect
    .get('/final')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('https://example.com/go1', { maxRedirects: 2 })

  expect(url).toBe('https://example.com/go3')
})

test('it should allow to use a different method', async () => {
  nock('https://example.com')
    .head('/test')
    .times(1)
    .reply(301, 'Moved', { location: 'https://example.com/test2' })
    .head('/test2')
    .times(1)
    .reply(200, 'OK')

  const url = await tall('https://example.com/test', { method: 'HEAD' })

  expect(url).toBe('https://example.com/test2')
})
