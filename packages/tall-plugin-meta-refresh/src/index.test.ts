import nock from 'nock'
import { locationHeaderPlugin, tall } from '../../tall'
import { metaRefreshPlugin } from './'

beforeEach(() => {
  nock.cleanAll()
})

test('it should unshorten a link using https', async () => {
  nock('https://example.com')
    .get('/a-link')
    .times(1)
    .reply(
      200,
      `<html>
         <head>
           <meta
             http-equiv="refresh"
             content="0;url=https://dest.pizza/a-link"
           />
         </head>
       </html>`
    )
  nock('https://dest.pizza').get('/a-link').times(1).reply(200, 'OK')

  const url = await tall('https://example.com/a-link', {
    plugins: [locationHeaderPlugin, metaRefreshPlugin]
  })

  expect(url).toBe('https://dest.pizza/a-link')
})
