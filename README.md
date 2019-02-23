# JQuery Routing Plugin
JQuery router is a routing plugin for single page jquery applications.

# Installation

Using npm:

```sh
npm install --save jqueryrouter
```

Using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jqueryrouter@2.1.0/dist/js/jquery.router.min.js"></script>
```

Previous version:
```sh
npm install --save jqueryrouter@1.3.0
```

### Note
1. Library version 1.X is an IIFE build and does not support ES6 applications. To use the library in ES6 porjects please use version 2.X.
2. For library version 2.X, you need to separately install ``jquery`` and ``jquerydeparam`` as peer dependencies.

```sh
npm install --save jquery jquerydeparam
```

# How to use?

<b>Add a script tag</b><br/>
```html
<script src="jquery.router.js"></script>
<script>
    const { router, route } = jqueryrouter;
</script>
```

<b>Use ES6 import (Webpack or Rollup)</b><br/>
```js
import { router, route } from 'jqueryrouter';
```

<b>Using jQuery</b>
```js
import $ from 'jquery';
import 'jqueryrouter';

$.route(...);
$.router.set(...);
```

# How it works?
<b>1. Create routes:</b><br/>
```js
$.route('/path/to/route1', function () { ... });
$.route('/path/to/route2', function () { ... });
$.route('/path/to/route3', function () { ... });
```
<b>2. Trigger a route by calling <code>$.router.set</code></b><br/>
```js
$.router.set('/path/to/route1');
```
The method changes current route and call the appropriate method that matches it.<br/><br/>
<b>3. Execute routes on page load. Call router's <code>init</code> method for that magic:</b><br/>
```js
$.router.init();
```
The method execute handler methods that matches the current route (without <code>$.router.set</code>). Alternatively, you can call <code>$.router.set(location.pathname);</code> on DOM ready.
```js
$(function () {
    ...
    $.router.set(location.pathname);
});
```
<b>4. Pass data to route handler:</b><br/>
```js
$.router.set({
    route: '/path/to/route',
    data: {
        key1: 'value1',
        key2: 'value2'
    }
});
...
$.route('/path/to/route', function (data) {
    console.log(data.key1); // 'value1'
    console.log(data.key2); // 'value2'
});
```
<b>5. Set route parameters:</b><br/>
```js
$.router.set('/path/to/route/hello/world');
...
$.route('/path/to/route/:param1/:param2', function (data, params) {
    console.log(params.param1); // hello
    console.log(params.param2); // world
});
```
<b>6. Set query parameters:</b><br/>
```js
$.router.set({
    route: '/path/to/route',
    queryString: 'q=123&s=helloworld'
});
...
$.route('/path/to/route', function (data, params, query) {
    console.log(query.q); // 123
    console.log(query.s); // 'helloworld'
});
```
<b>7. Change current page path without updating history:</b><br/>
```js
var replaceMode = true;
$.router.set('/path/to/route', replaceMode);
```
<b>8. Change current page path without calling handler function:</b><br/>
```js
...
var doNotCallHandler = true;
$.router.set('/path/to/route', replaceMode, doNotCallHandler);
```
<b>9. Set \# routes:</b><br/>
```js
$.router.set('#/path/to/route');
...
$.route('/path/to/route', function () {
    console.log('Still works');
});
```
This forces plugin to change URL hash instead of pathname.<br/>

<b>10. Detach routes:</b><br/>
For performance reasons, it's a good idea to detach routes when your application unmounts. As of version 1.3.0 we have added ``unroute`` method which allows us to remove attached handlers.

```js
$.unroute(); // Removes all routes
$.unroute('/path/to/route'); // Removes all handlers attached to given route
$.unroute('/path/to/route', handlerFn); // Removes handler function attached to the given route
```

# Browser support
Jquery router has been tested in following browsers:
<b>Desktop:</b> IE 9 - 11, Chrome, Firefox, Safari, Opera, Edge
<b>Mobile:</b> Chrome, Safari, Firefox

# Debugging
<a href="https://github.com/scssyworks/jqueryrouter/blob/master/DEBUGGING.md">Debugging</a>

# Demo
https://jqueryrouter.herokuapp.com/
