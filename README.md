# tall

[![npm version](https://badge.fury.io/js/tall.svg)](http://badge.fury.io/js/tall)
[![CircleCI](https://circleci.com/gh/lmammino/tall.svg?style=shield)](https://circleci.com/gh/lmammino/tall)
[![codecov.io](https://codecov.io/gh/lmammino/tall/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/tall)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Promise-based, No-dependency URL unshortner (expander) module for Node.js

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

async someFunction() {
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
var tall = require('tall').default
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
- `headers` (default {}): change request headers - e.g. {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'}

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

## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/tall/issues).

## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
