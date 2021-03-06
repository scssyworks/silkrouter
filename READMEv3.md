[![Build Status](https://travis-ci.org/scssyworks/silkrouter.svg?branch=master)](https://travis-ci.org/scssyworks/silkrouter) ![GitHub](https://img.shields.io/github/license/scssyworks/silkrouter)

# [[NOTICE]]

Silk router version 3 will no longer receive security updates going forward. Please upgrade to the latest version 4.

# Silkrouter

Silkrouter is a routing library for single page applications.

# Install

### NPM

<b>Stable release</b>

```sh
npm install --save silkrouter@3
```

### CDN

```html
<script src="https://cdn.jsdelivr.net/npm/silkrouter@3"></script>
```

### JQuery version

```sh
npm install --save jqueryrouter
```

### Notes

1. JQuery version supports IE9 and other legacy browsers. For more details please <a href="https://www.npmjs.com/package/jqueryrouter">click here</a>.

# How to use Silk Router?

Silkrouter follows a familiar concept. If you have worked with custom events, you should get started with `silkrouter` in no time.

## Import dependencies

```js
import { router, route, unroute } from 'silkrouter';
```

## Add listeners

```js
route('/path/to/route', (e) => { ... }); // Supports both primary and hash routing (Use "e.hash" to differentiate)
route('#/path/to/route', (e) => { ... }); // Supports hash routing
route((e) => { ... }); // A generic route listens to every route change
```

## Trigger an event

```js
router.set('/path/to/route');
router.set('#/path/to/route'); // <-- Triggers hash route
```

## Complex examples

### Set query string parameters

```js
route('/path/to/route', (e) => {
  const { q, r } = e.query;
  console.log(q, r); // -> 'Hello', 'World'
});

router.set({
  route: '/path/to/route',
  queryString: 'q=Hello&r=World',
});
```

### Preserve an existing query string

```js
router.set({
  route: '/path/to/route',
  queryString: 'q=Hello&r=World',
  appendQuery: true,
});
```

### Use parameters within route

```js
route('/path/:to/:route', (e) => {
  const { to, route } = e.params;
  console.log(to, route); // -> 'hello', 'world'
});

router.set('/path/hello/world');
```

### Pass data directly to a handler

```js
route('/path/to/route', (e) => {
  console.log(e.data); // -> 'Hello World!'
});

router.set({
  route: '/path/to/route',
  data: 'Hello World!',
});
```

## Multi-routing concepts

Silkrouter has several options to handle multiple routes.

### Route list [Experimental]

```js
route([
    '/route1',
    '#/route2'
], (e) => { ... });
```

### Generic routing

```js
route((e) => {
    switch(e.route) {
        case '/route1': ...;
        case '#/route2': ...;
        default: ...; // Handle error route here
    }
});
```

### Handle errors

Version 3.5.0 adds a new feature which makes error handling much easier.

1. Add routes

```js
// Routes
route('/path/1', () => { ... });
route('/path/2/:var1', () => { ... });
route('/path/3/:var2/:var3', () => { ... });
```

2. Add error route

```js
// Error page handling using generic route
route((e) => {
  if (
    !router.includes(
      router.list().filter((r) => r !== '*'), // Ignore current route using "filter"
      e.route
    )
  ) {
    // Handler error page
  }
});
```

## Ignore case

### [Experimental]

```js
routeIgnoreCase('/mandatory/route/string', (e) => {
  console.log(e.route); // -> '/MandATorY/RoUte/StriNg'
});

router.set('/MandATorY/RoUte/StriNg');
```

## Helper methods

### Handle route parameters using "routeParams"

```js
import { route, routeParams } from 'silkrouter';
...
route(e => {
    const paramsMap = routeParams('/test/:var1/:var2', e.route); // Returns {var1: "hello", var2: "world"} for "/test/hello/world"
});
```

### Handle query strings using "param" and "deparam"

Param creates are query string from an object. Deparam just reverses it.

```js
import { param, deparam } from 'silkrouter';
...
const qs = param({ a: 10, b: 20 }); // -> a=10&b=20
const qsObject = deparam(qs); // -> { a: "10", b: "20" }
// Deparam with coerced values
const qsObCoerced = deparam(qs, true); // -> {a: 10, b: 20}
```

## Detach listeners

```js
unroute(); // Removes all listeners
unroute('/path/to/route'); // Removes all listeners for current route
unroute('/path/to/route', fn); // Removes current listener
unroute(fn); // Removes current generic listener
unroute([...], fn); // Removes current list listener
```

# Debugging

<a href="https://github.com/scssyworks/silkrouter/blob/master/DEBUGGINGv3.md">https://github.com/scssyworks/silkrouter/blob/master/DEBUGGINGv3.md</a>

# Demo

<a href="https://silkrouter.herokuapp.com/">https://silkrouter.herokuapp.com</a>
