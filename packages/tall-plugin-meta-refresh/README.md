# tall-plugin-meta-refresh

A plugin for [`tall`](https://npm.im/tall) that allows you to follow meta refresh redirects such as:

```html
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>The Tudors</title>
    <meta
      http-equiv="refresh"
      content="0;URL='http://thetudors.example.com/'"
    />
  </head>
  <body>
    <p>
      This page has moved to a
      <a href="http://thetudors.example.com/"> theTudors.example.com</a>.
    </p>
  </body>
</html>
```

Example from [W3C](https://www.w3.org/TR/WCAG20-TECHS/H76.html).

## Installation

With npm:

```bash
npm i --save tall-plugin-meta-refresh
```

## Usage

To enable the plugin on a given `tall` instance:

```typescript
import { locationHeaderPlugin, tall } from 'tall'
import { metaRefreshPlugin } from 'tall-plugin-meta-refresh'

const url = await tall('https://example.com/a-link', {
  plugins: [locationHeaderPlugin, metaRefreshPlugin]
})

console.log(url)
```

> **Note**: the `locationHeaderPlugin` is the standard behavior (following HTTP header location headers) and it should always be used before the `metaRefreshPlugin`.

> **Note**: also be aware that the `metaRefreshPlugin` will consume the entire HTTP response object, so other plugins that might be added after it won't be able to parse the response body.
