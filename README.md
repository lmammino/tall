# tall

[![npm version](https://img.shields.io/npm/v/tall)](https://npm.im/tall)
[![Build Status](https://github.com/lmammino/tall/workflows/main/badge.svg)](https://github.com/lmammino/tall/actions?query=workflow%3Amain)
[![codecov.io](https://codecov.io/gh/lmammino/tall/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/tall)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Written in TypeScript](https://badgen.net/badge/-/TypeScript?icon=typescript&label&labelColor=blue&color=555555)](https://www.typescriptlang.org/)

Promise-based, No-dependency URL unshortner (expander) module for Node.js 12+.

**Note**: This library is written in **TypeScript** and type definitions are provided.


## Install

Using npm

```bash
npm install --save tall
```

or with yarn

```bash
yarn add tall
```

## Usage

ES6+ usage:

```javascript
import { tall } from 'tall'

tall('http://www.loige.link/codemotion-rome-2017')
  .then(unshortenedUrl => console.log('Tall url', unshortenedUrl))
  .catch(err => console.error('AAAW 👻', err))
```

With Async await:

```javascript
import { tall } from 'tall';

async function someFunction() {
  try {
    const unshortenedUrl = await tall('http://www.loige.link/codemotion-rome-2017');
    console.log('Tall url', unshortenedUrl);
  } catch (err) {
    console.error('AAAW 👻', err);
  }
}

someFunction();
```

ES5:

```javascript
var { tall } = require('tall')
tall('http://www.loige.link/codemotion-rome-2017')
  .then(function(unshortenedUrl) {
    console.log('Tall url', unshortenedUrl)
  })
  .catch(function(err) {
    console.error('AAAW 👻', err)
  })
```

## Options

It is possible to specify some options as second parameter to the `tall` function.

Available options are the following:

- `method` (default `"GET"`): any available HTTP method
- `maxRedirects` (default `3`): the number of maximum redirects that will be followed in case of multiple redirects.
- `headers` (default `{}`): change request headers - e.g. `{'User-Agent': 'your-custom-user-agent'}`
- `timeout`: (default: `120000`): timeout in milliseconds after which the request will be cancelled
- `plugins`: (default: `[locationHeaderPlugin]`): a list of [plugins](#plugins) for adding advanced behaviours

In addition, any other options available on [http.request()](`https://nodejs.org/api/http.html#httprequestoptions-callback`) or `https.request()` are accepted. This for example includes `rejectUnauthorized` to disable certificate checks.

Example:

```javascript
import { tall } from 'tall'

tall('http://www.loige.link/codemotion-rome-2017', {
  method: 'HEAD',
  maxRedirect: 10
})
  .then(unshortenedUrl => console.log('Tall url', unshortenedUrl))
  .catch(err => console.error('AAAW 👻', err))
```


## Plugins

Since `tall` v5, a plugin system for extending the default behaviour of tall is available.

By default `tall` comes with 1 single plugin, the `locationHeaderPlugin` which is enabled by default. This plugin follows redirects by looking at the `location` header in the HTTP response received from the source URL.

You might want to write your own plugins to have more sophisticated behaviours.

Some example?

 - Normalise the final URL if the final page has a `<link rel="canonical" href="http://example.com/page/" />` tag in the `<head>` of the document
 - Follow HTML meta refresh redirects (`<meta http-equiv="refresh" content="0;URL='http://example.com/'" />`)


## How to write a plugin

A plugin is simply a function with a specific signature:

```typescript
export interface TallPlugin {
  (url: URL, response: IncomingMessage, previous: Follow | Stop): Promise<Follow | Stop>
}
```

So the only thing you need to do is to write your custom behaviour following this interface. But let's discuss briefly what the different elements mean here:

  - `url`: Is the current URL being crawled
  - `response`: is the actual HTTP response object representing the current
  - `previous`: the decision from the previous plugin execution (continue following a given URL or stop at a given URL)

Every plugin is executed asynchronously, so a plugin returns a Promise that needs to resolve to a `Follow` or a `Stop` decision.

Let's deep dive on these two concepts. `Follow` and `Stop` are defined as _follows_ (touché):

```typescript
export class Follow {
  follow: URL
  constructor (follow: URL) {
    this.follow = follow
  }
}

export class Stop {
  stop: URL
  constructor (stop: URL) {
    this.stop = stop
  }
}
```

`Follow` and `Stop` are effectively simple classes to express an intent: *should we follow the `follow` URL or should we stop at the `stop` URL?*

Plugins are executed following the middleware pattern (or chain of responsability): they are executed in order and the information is propagated from one to the other.

For example if we initialise `tall` with `{ plugins: [plugin1, plugin2] }`, for every URL, `plugin1` will be executed before `plugin2` and the decision of `plugin1` will passed over onto `plugin2` using the `previous`) parameter.


## How to write and enable a plugin

Let's say we want to add a plugin that allows us to follow HTML meta refresh redirects, the code could look like this:

```typescript
// metarefresh-plugin.ts
import { IncomingMessage } from 'http'
import { Follow, Stop } from 'tall'

export async function metaRefreshPlugin (url: URL, response: IncomingMessage, previous: Follow | Stop): Promise<Follow | Stop> {
  let html = ''
  for await (const chunk of response) {
    html += chunk.toString()
  }

  // note: this is actually not a great idea, it's best to use something like `cheerio` to properly parse HTML
  // but for the sake of illustrating how to use plugins this is good enough here...
  const metaHttpEquivUrl = html.match(/meta +http-equiv="refresh" +content="\d;url=(http[^"]+)"/)?.[1]

  if (metaHttpEquivUrl) {
    return new Follow(new URL(metaHttpEquivUrl))
  }

  return previous
}
```

Then, this is how you would use your shiny new plugin:

```typescript
import {tall, locationHeaderPlugin} from 'tall'
import { metaRefreshPlugin } from './metarefresh-plugin'

const finalUrl = await tall('https://loige.link/senior', { plugins: [locationHeaderPlugin, metaRefreshPlugin] })

console.log(finalUrl)
```

Note that we have to explicitly pass the `locationHeaderPlugin` if we want to retain `tall` original behaviour.




## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/tall/issues).

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
