# SILK Router
SILK router (formerly <a href="https://github.com/scssyworks/silkrouter/tree/feature/ver2">jqueryrouter</a>) is a JavaScript library for single page application routing.

# Installation

### NPM
<b>Stable release</b>
```sh
npm install --save silkrouter deparam.js lzstorage
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/silkrouter@3.1.2/dist/js/silkrouter.min.js"></script>
```

### JQuery version
```sh
npm install --save jqueryrouter@2.2.2
```

### Notes
1. This version does not support IE9 or any other legacy browsers. Please use jQuery version (2.2.2) if you want IE9 support.

### Peer dependencies
<a href="https://www.npmjs.com/package/deparam.js">Deparam.js</a><br>
<a href="https://www.npmjs.com/package/lzstorage">LZ Storage</a>

# Using SILK router

<b>Add a script tag</b><br/>
```html
<script src="silkrouter.js"></script>
<script>
    const { router, route } = silkrouter;
</script>
```

<b>Use ES6 import (Webpack or Rollup)</b><br/>
```js
import { router, route } from 'silkrouter';
```

# How does it works?
<b>1. Create routes:</b><br/>
```js
route('/path/to/route1', function () { ... });
route('/path/to/route2', function () { ... });
route('#/path/to/route3', function () { ... }); // Hash route (added in v3)
```

<b>2. Create multiple routes [Experimental]:</b><br/>
```js
route([
    '/path/to/route/1',
    '/path/to/route/2',
    '#/path/to/route/3'
], function (e) {
    console.log(e.route); // Prints route that matches
    ... 
});
```

<b>3. Trigger a route by calling <code>router.set</code></b><br/>
```js
router.set('/path/to/route1');
```

<b>4. Pass data:</b><br/>
```js
router.set({
    route: '/path/to/route',
    data: {
        key1: 'value1',
        key2: 'value2'
    }
});
...
route('/path/to/route', function (config) {
    const { data } = config;
    console.log(data.key1); // 'value1'
    console.log(data.key2); // 'value2'
});
```
<b>5. Route parameters:</b><br/>
```js
router.set('/path/to/route/hello/world');
...
route('/path/to/route/:param1/:param2', function (config) {
    const { params } = config;
    console.log(params.param1); // hello
    console.log(params.param2); // world
});
```
<b>6. Query parameters:</b><br/>
```js
router.set('/path/to/route?q=123&s=helloworld');
// OR
router.set({
    route: '/path/to/route',
    queryString: 'q=123&s=helloworld'
});
...
route('/path/to/route', function (config) {
    const { query } = config;
    console.log(query.q); // 123
    console.log(query.s); // 'helloworld'
});
```
<b>7. Change current page path without updating history:</b><br/>
```js
var replaceMode = true;
router.set('/path/to/route', replaceMode);
// OR
router.set({
    route: '/path/to/route',
    replaceMode
});
```
<b>8. Change current page path without calling handler function:</b><br/>
```js
...
var noTrigger = true;
router.set('/path/to/route', replaceMode, noTrigger);
// OR
router.set({
    route: '/path/to/route',
    noTrigger
});
```
<b>9. Set \# routes:</b><br/>
```js
router.set('#/path/to/route');
...
// Handler called for both pathname and hash changes
route('/path/to/route', function () {
    console.log('Still works');
});
// Handler called only for hash changes
route('#/path/to/route', function () {
    console.log('Also works');
});
```
This forces plugin to change URL hash instead of pathname.<br/>

<b>10. Detach routes:</b><br/>
You can remove routes on application unmount using ``unroute`` method. (Added in v1.3.0)

```js
unroute(); // Removes all routes
unroute('/path/to/route'); // Removes all handlers attached to given route
unroute('/path/to/route', handlerFn); // Removes handler function attached to the given route
```

# Browser support
SILK router has been tested in following browsers:
<b>Desktop:</b> IE 10+, Chrome, Firefox, Safari, Opera, Edge
<b>Mobile:</b> Chrome, Safari, Firefox

# Debugging
<a href="https://github.com/scssyworks/silkrouter/blob/master/DEBUGGING.md">Debugging</a>

# Demos

### Old version
https://jqueryrouter.herokuapp.com/

### Current version
https://silkrouter.herokuapp.com/

Spot the difference ;)
