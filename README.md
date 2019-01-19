# JQuery Routing Plugin
JQuery router is a web routing plugin created to support single page applications.

# Installation

```js
npm install jqueryrouter
```

<b>Note:</b> This is an IIFE build, hence you need to add it as script tag to make it work. If you are looking for a UMD build, please checkout <a href="https://github.com/scssyworks/jqueryrouter/tree/feature/ver2">dev branch</a>. You can install the beta version using <code>npm install jqueryrouter@beta</code>.

# How to use?
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

<b>10. Remove set routes:</b><br/>
For performance reasons, it's often a good idea to remove routes that are currently attached when your application unmounts. As of version 1.3.0 we have added ``unroute`` method which allows us to remove attached handlers.
```js
$.unroute(); // Removes all routes
$.unroute('/path/to/route'); // Removes all handlers attached to given route
$.unroute('/path/to/route', handlerFn); // Removes handler function attached to the given route
```

# Browser support
Jquery router supports all major desktop and mobile browsers including IE9.

# Debugging
<a href="https://github.com/scssyworks/jqueryrouter/blob/master/DEBUGGING.md">Debugging</a>

# Demo
https://jqueryrouter.herokuapp.com/
