# Makler

## Multi topic message broker

Makler is a functional multi topic buffered message broker written in TypeScript. It runs in the browser, or on the server using node.js.

### Setup

```bash
yarn add makler
```

or

```bash
npm install --save makler
```

### Usage

Before you start import the library

```javascript
import { create, topic, publish, subscribe } from 'makler'
```

#### Basic usage

```javascript
// Setup a new bus with no buffer
const broker = create()
const chan = topic(broker, ['topic'])

// Data published can be anything
const context = { test: true }

// Setup a subscriber
const unsubscribe = subscribe(broker, (data, topic) => {
  console.log(data, topic) // { test: true } ["topic"]
})

// Publish some data
publish(chan, context)

// Cleanup
unsubsribe()
```

## License

[MIT](LICENSE)
