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

  // note: this is actually not a great idea, it's best to use something like cheerio to parse HTML
  // but for the sake of illustrating how to use plugins this is good enough here...
  const metaHttpEquivUrl = html.match(
    /meta +http-equiv="refresh" +content="\d;url=(http[^"]+)"/
  )?.[1]

  if (metaHttpEquivUrl) {
    return new Follow(new URL(metaHttpEquivUrl))
  }

  return previous
}
