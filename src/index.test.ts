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

// TODO: add test for max redirects
// TODO: add a test for a different method
// TODO: add a test for sending headers
// TODO: add a test for no redirect
