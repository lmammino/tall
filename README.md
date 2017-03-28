# tall

[![npm version](https://badge.fury.io/js/tall.svg)](http://badge.fury.io/js/tall)
[![CircleCI](https://circleci.com/gh/lmammino/tall.svg?style=svg)](https://circleci.com/gh/lmammino/tall)
[![codecov.io](https://codecov.io/gh/lmammino/tall/coverage.svg?branch=master)](https://codecov.io/gh/lmammino/tall)

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
import { tall } from 'tall';

tall('http://www.loige.link/codemotion-rome-2017')
  .then(unshortenedUrl => console.log('Tall url', unshortenedUrl))
  .catch(err => console.err('AAAW 👻', err))
;
```

With Async await:

```javascript
import { tall } from 'tall';

async someFunction() {
  try {
    const unshortenedUrl = await tall('http://www.loige.link/codemotion-rome-2017');
    console.log('Tall url', unshortenedUrl);
  } catch (err) {
    console.err('AAAW 👻', err);
  }
}

someFunction();
```

ES5:

```javascript
var tall = require('tall').default;
tall('http://www.loige.link/codemotion-rome-2017')
  .then(unshortenedUrl => console.log('Tall url', unshortenedUrl))
  .catch(err => console.err('AAAW 👻', err))
;
```


## Contributing

Everyone is very welcome to contribute to this project.
You can contribute just by submitting bugs or suggesting improvements by
[opening an issue on GitHub](https://github.com/lmammino/tall/issues).


## License

Licensed under [MIT License](LICENSE). © Luciano Mammino.
