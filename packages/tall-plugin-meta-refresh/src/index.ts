import { IncomingMessage } from 'node:http'
import * as htmlparser2 from 'htmlparser2'
import { Follow, Stop } from 'tall'

export async function metaRefreshPlugin(
  url: URL,
  response: IncomingMessage,
  previous: Follow | Stop
): Promise<Follow | Stop> {
  let metaRefreshUrl: string | undefined
  let bodyFound = false

  const parser = new htmlparser2.Parser({
    onopentag(name, attributes) {
      if (name === 'body') {
        bodyFound = true
      } else if (
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
    if (metaRefreshUrl || bodyFound) {
      // avoid parsing the entire response if we already found the meta refresh tag
      // or if we reached the body tag
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
