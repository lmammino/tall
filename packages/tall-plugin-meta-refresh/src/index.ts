import * as htmlparser2 from 'htmlparser2'
import { IncomingMessage } from 'http'
import { Follow, Stop } from 'tall'

export async function metaRefreshPlugin(
  url: URL,
  response: IncomingMessage,
  previous: Follow | Stop
): Promise<Follow | Stop> {
  let metaRefreshUrl: string | undefined

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (
        !metaRefreshUrl &&
        name === 'meta' &&
        attributes['http-equiv'] === 'refresh'
      ) {
        const match = attributes.content.match(/url=['"]?([^'"]*)/i)
        if (match) {
          metaRefreshUrl = match[1]
        }
      }
    }
  })

  for await (const chunk of response) {
    if (metaRefreshUrl) {
      // avoid parsing the entire response if we already found the meta refresh tag
      break
    }
    parser.write(chunk.toString())
  }
  response.destroy()
  parser.end()

  if (metaRefreshUrl) {
    return new Follow(new URL(metaRefreshUrl))
  }

  return previous
}
