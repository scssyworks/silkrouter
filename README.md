# Silk Router
Silk router (formerly <a href="https://github.com/scssyworks/silkrouter/tree/feature/ver2">jqueryrouter</a>) is a JavaScript library for single page application routing.

# Installation

### NPM
<b>Unstable release</b>
```sh
npm install --save silkrouter@3.0.0-beta.11
```

### CDN
```html
<script src="https://cdn.jsdelivr.net/npm/silkrouter@3.0.0-beta.6/dist/js/silkrouter.min.js"></script>
```

### Previous versions
<b>Unstable release</b>
```sh
npm install --save jqueryrouter@3.0.0-beta.3 deparam.js lzstorage
```

<b>Stable release</b>
```sh
npm install --save jqueryrouter@2.1.0
```

### Notes
1. Version 3 (beta.4 and above) is implemented in ES6. For jQuery version please download version 2 above.
2. Version 3 has ended support for IE9 in favour of history API.

### Peer dependencies
<a href="https://www.npmjs.com/package/deparam.js">Deparam.js</a>
<a href="https://www.npmjs.com/package/lzstorage">LZ Storage</a>

# Using silk router

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
route('#/path/to/route3', function () { ... }); // Hash route (added in v3.0.0-beta.5)
```
<b>2. Trigger a route by calling <code>router.set</code></b><br/>
```js
router.set('/path/to/route1');
```

<b>4. Pass data to route handler:</b><br/>
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
Silk router has been tested in following browsers:
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