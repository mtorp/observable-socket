# observable-socket

An observable socket, no duh. Works with
[ws](https://github.com/websockets/ws) and
[window.WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

Observable-socket assumes a few things:
* Promises are available. If you're targeting an environment that does not
  support native Promises, use
  [babel-polyfill](https://babeljs.io/docs/usage/polyfill/) or something
  similar.
* You'll be using something like [Browserify](http://browserify.org/) or
  [webpack](https://webpack.github.io/) if working with window.WebSocket.

# Usage

install it.

```shell
npm install observable-socket
```

import and use it.

```js
import ObservableSocket from 'observable-socket'

/**
 * Create an echo socket by connecting to the echo socket provided by
 * websocket.org.
 */
const echoSocket = ObservableSocket(new WebSocket('wss://echo.websocket.org'))

/**
 * We can send messages before we subscribe. Messages will be queued until you
 * subscribe to the `echoSocket.observable` then they will be sent in order.
 */
echoSocket.send('hi!')

/**
 * Subscribing to the `echoSocket.observable` connects to the socket and sends queued
 * messages.
 */
echoSocket.observable.subscribe(

  function onNext (data) {
    console.log(data)
  },

  function onError (e) {
    console.error('uh oh! ', e)
  },

  function onCompleted () {
    console.warn('Socket has closed')
  }

)
```

# API

This module exports a function that takes a WebSocket url and returns an object
of the shape:

```
{
  send: <Function>,
  observable: <Observable>
}
```

We will call that shape `socket`.

Here's how to get a socket that connects to websocket.org's echo websocketi:

```js
import ObservableSocket from 'observable-socket'

const socket = ObservableSocket(new WebSocket('wss://echo.websocket.org'))
```

## socket.observable

The observable is an [RxJS](https://github.com/Reactive-Extensions/RxJS) observable
that represents incoming messages from the socket.

## socket.send

`send` is a function to push messages into the socket. This will create
a queue of messages that will not be sent until you subscribe to the
observable. After you are subscribed sent messages will execute ASAP.
