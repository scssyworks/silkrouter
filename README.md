[![Build Status](https://travis-ci.org/scssyworks/silkrouter.svg?branch=master)](https://travis-ci.org/scssyworks/silkrouter) ![GitHub](https://img.shields.io/github/license/scssyworks/silkrouter)

# Silkrouter
Silkrouter is a reactive app routing library for single page applications.

# Silkrouter v4 is here
Silkrouter v4 is now beta. To install beta version use the command below:

```sh
npm install --save silkrouter@4.0.0-beta.4 rxjs
```

# Install

### NPM
```sh
npm install --save silkrouter
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/silkrouter@latest"></script>
```

### JQuery version
```sh
npm install --save jqueryrouter jquery deparam.js
```

### Notes
1. JQuery version supports IE9 and other legacy browsers. For more details please <a href="https://www.npmjs.com/package/jqueryrouter">click here</a>.

# How to use Silk Router?

Silkrouter is easy to use library for application routing. It's syntax is comparable to ``jQuery`` custom events.

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
    queryString: 'q=Hello&r=World'
});
```

### Preserve an existing query string

```js
router.set({
    route: '/path/to/route',
    queryString: 'q=Hello&r=World',
    appendQuery: true
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
    data: 'Hello World!'
});
```

## Passing a list of routes

Silkrouter has several options to handle multiple routes.

### Route list

```js
route([
    '/route1',
    '#/route2'
], (e) => { ... });
```

### Generic router

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

Version 3.5.0 adds a new feature which makes error handling easier.

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
route(e => {
    if (!router.includes(
        router.list().filter(r => r !== '*'), // Ignore current route using "filter"
        e.route
    )) {
        // Handler error page
    }
});
```

## Ignore case

```js
routeIgnoreCase('/mandatory/route/string', (e) => {
    console.log(e.route); // -> '/MandATorY/RoUte/StriNg'
});

router.set('/MandATorY/RoUte/StriNg');
```
## Helpers

### Handling route parameters with "routeParams" function

```js
import { route, routeParams } from 'silkrouter';
...
route(e => {
    const paramsMap = routeParams('/test/:var1/:var2', e.route); // Returns {var1: "hello", var2: "world"} for "/test/hello/world"
});
```

### Handling query strings with "param" and "deparam" functions

Param creates are query string from an object. Deparam just reverses it.

```js
import { param, deparam } from 'silkrouter';
...
const qs = param({ a: 10, b: 20 }); // -> a=10&b=20
const qsObject = deparam(qs); // -> { a: "10", b: "20" }
// Deparam with coerced values
const qsObCoerced = deparam(qs, true); // -> {a: 10, b: 20}
```

## Unbind listeners

```js
unroute(); // Removes all listeners
unroute('/path/to/route'); // Removes all listeners for current route
unroute('/path/to/route', fn); // Removes current listener
unroute(fn); // Removes current generic listener
unroute([...], fn); // Removes current list listener
```

# Debugging

<a href="https://github.com/scssyworks/silkrouter/blob/master/DEBUGGING.md">https://github.com/scssyworks/silkrouter/blob/master/DEBUGGING.md</a>

# Demo

<a href="https://silkrouter.herokuapp.com/">https://silkrouter.herokuapp.com</a>