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

  // note: This is just a dummy example to illustrate how to use the plugin API.
  // It's not a great idea to parse HTML using regexes.
  // If you are looking for a plugin that does this in a better way check out
  // https://npm.im/tall-plugin-meta-refresh
  const metaHttpEquivUrl = html.match(
    /meta +http-equiv="refresh" +content="\d;url=(http[^"]+)"/
  )?.[1]

  if (metaHttpEquivUrl) {
    return new Follow(new URL(metaHttpEquivUrl))
  }

  return previous
}
