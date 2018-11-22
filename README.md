# JQuery Routing Plugin
JQuery router is a web routing plugin created to support single page applications.

# Installation

```js
npm install jqueryrouter
```

<b>Note:</b> Please note that this is still an IIFE build, and you would manually need to include a script tag to make it work. We are working on version 2.0 which is a UMD build which will be released on November 30th. Stay tuned!

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

# Browser support
Jquery router supports all major desktop and mobile browsers including IE9.

# Debugging
<b>1. Differentiating between \# and pathname if both are same:</b><br/>
In certain scenarios modern browsers trigger both <code>hashchange</code> and <code>popstate</code> events when URL hash is updated. This causes route handler to execute twice when both \# and pathname are same.
Example: http://example.com/path/to/route#/path/to/route
```js
$.route('/path/to/route', function () {
   console.log('Executed twice');
});
```
Simply add a safety check to identify which is which:
```js
$.route('/path/to/route', function (data) {
    if (data.hash) {
        console.log('Executes on hashchange');
    } else {
        console.log('Executes on popstate');
    }
});
```
<b>2. Router's <code>init</code> method doesn't work:</b><br/>
The only reason why it doesn't work is because it needs route handlers to be attached first.
```js
$.router.init();
$.route('/path/to/route', function () {
    console.log('Does it work?'); // No
});
...
$.route('/path/to/route', function () {
    console.log('Does it work?'); // Yes! It does
});
$.router.init();
```
<b>3. My routes are not working</b><br/>
JQuery router plugin does a validation check on routes. A correct route always starts with a <code>/</code>.
```js
$.route('/path/to/route', function () { ... }); // Correct
$.route('path/to/route', function () { ... }); // Incorrect
```
<b>4. I am creating too many routes for doing same set of things</b><br/>
JQuery router comes with an option of generic routes.
```js
$.route('*', function (data) {
    if (data.route === '/path/to/route') {
        console.log('Just works!');
    }
});
```
You can always differentiate between <code>hashchange</code> and <code>popstate</code> events by checking <code>data.hash</code>.
# Demo
https://jqueryrouter.herokuapp.com/
