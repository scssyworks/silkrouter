[![Build Status](https://travis-ci.org/scssyworks/silkrouter.svg?branch=master)](https://travis-ci.org/scssyworks/silkrouter) ![GitHub](https://img.shields.io/github/license/scssyworks/silkrouter) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/index.esm.min.js?label=minified) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/index.esm.js?label=unminified)

# Silkrouter
Silkrouter is an SPA (Single Page Apps) routing library.

# Install

### NPM
<b>Stable release</b>
```sh
npm install --save silkrouter
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/silkrouter@latest"></script>
```

### JQuery version
```sh
npm install --save jqueryrouter@2.2.6
```

### Notes
1. JQuery version supports IE9 and other legacy browsers. For more details please <a href="https://www.npmjs.com/package/jqueryrouter">click here</a>.

# How to use Silk Router?

Silkrouter follows a very simple concept. If you are familiar with custom events, it wouldn't take you much time to learn ``silkrouter``.

## Import dependencies

```js
import { router, route, unroute } from 'silkrouter';
```

## Attach route listeners

```js
route('/path/to/route', (e) => { ... }); // For normal and hash routing (Use "e.hash" flag to differentiate)
route('#/path/to/route', (e) => { ... }); // For hash routing
route((e) => { ... }); // Generic route -> Listens to everything
```

## Trigger a route change event

```js
router.set('/path/to/route');
router.set('#/path/to/route'); // <-- Triggers hash route
```

## Complex examples:

### Setting query string

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

### Preserve existing query string

```js
router.set({
    route: '/path/to/route',
    queryString: 'q=Hello&r=World',
    appendQuery: true
});
```

### Using route parameters

```js
route('/path/:to/:route', (e) => {
    const { to, route } = e.params;
    console.log(to, route); // -> 'hello', 'world'
});

router.set('/path/hello/world');
```

### Pass data

```js
route('/path/to/route', (e) => {
    console.log(e.data); // -> 'Hello World!'
});

router.set({
    route: '/path/to/route',
    data: 'Hello World!'
});
```

## Handle multiple routes

Silkrouter has several options to handle multiple routes.

### Route list [Experimental]

```js
route([
    '/route1',
    '#/route2'
], (e) => { ... });
```

### Generic routes

```js
route((e) => {
    switch(e.route) {
        case '/route1': ...;
        case '#/route2': ...;
        default: ...; // Handle error route here
    }
});
```

## Ignore route case

### [Experimental]

```js
routeIgnoreCase('/mandatory/route/string', (e) => {
    console.log(e.route); // -> '/MandATorY/RoUte/StriNg'
});

router.set('/MandATorY/RoUte/StriNg');
```

## Detach routes

Detaching routes is simple:

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