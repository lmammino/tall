import { Readable } from 'node:stream'
import { IncomingMessage } from 'node:http'
import nock from 'nock'
import { locationHeaderPlugin, tall, Follow, Stop } from '../../tall'
import { metaRefreshPlugin } from './'

beforeEach(() => {
  nock.cleanAll()
})

test('it follows meta refresh redirects', async () => {
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

test('it does not follow meta refresh redirects if not found', async () => {
  nock('https://example.com')
    .get('/a-link')
    .times(1)
    .reply(
      200,
      `<html>
         <head>
         </head>
       </html>`
    )
  nock('https://dest.pizza').get('/a-link').times(1).reply(200, 'OK')

  const url = await tall('https://example.com/a-link', {
    plugins: [locationHeaderPlugin, metaRefreshPlugin]
  })

  expect(url).toBe('https://example.com/a-link')
})

test('it stop parsing as soon as the meta redirect tag is found', async () => {
  const response = Readable.from([
    `<html>
  <head>
  <meta
    http`,
    `-equiv="refresh"
    content="0;url=https://dest.pizza/a-link"
  />`,
    `</head>
  <body>
   <h1>hello</h1>
   <p>Hello World</p>
 </body>
</html>`
  ])

  const url = new URL('https://example.com/a-link')
  const previous = new Follow(url)

  const result = await metaRefreshPlugin(
    url,
    response as IncomingMessage,
    previous
  )

  expect(result as Follow).toEqual(
    new Follow(new URL('https://dest.pizza/a-link'))
  )
})
