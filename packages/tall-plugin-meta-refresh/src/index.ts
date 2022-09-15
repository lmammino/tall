import htmlparser2 from 'htmlparser2'
import { IncomingMessage } from 'http'
import { Follow, Stop } from 'tall'

export async function metaRefreshPlugin(
  url: URL,
  response: IncomingMessage,
  previous: Follow | Stop
): Promise<Follow | Stop> {
  let html = ''
  for await (const chunk of response) {
    html += chunk.toString()
  }

  let metaRefreshUrl

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      /*
       * This fires when a new tag is opened.
       *
       * If you don't need an aggregated `attributes` object,
       * have a look at the `onopentagname` and `onattribute` events.
       */
      if (name === 'meta' && attributes['http-equiv'] === 'refresh') {
        const match = attributes.content.match(/url=(.*)/)
        if (match) {
          metaRefreshUrl = match[1]
        }
      }
    }
  })

  parser.write(html)
  parser.end()

  if (metaRefreshUrl) {
    return new Follow(new URL(metaRefreshUrl))
  }

  return previous
}
