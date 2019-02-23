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
You can differentiate between <code>hashchange</code> and <code>popstate</code> events by checking <code>data.hash</code>.<br/><br/>
<b>4. JQuery router does not maintain state</b><br/>
JQuery router does not maintain state like history API. This is because state management is not fully supported by hash routing and is partially supported by pushstate in some browsers. These is also a size limit. Pushstate allocates a limited amount of memory for state, hence it can only handle small amount of data.<br/>
For now state management is not part of JQuery router. This feature is under development and should be available soon.<br/><br/>
<b>5. JQuery router is executing route handlers unexpectedly!</b><br/>
It is a familiar fact that ``popstate`` event fires only when a state change occurs in browser history. It means that the ``popstate`` is fired only when you navigate back or forth. If you are createing new history, you need to execute your code manually. This is not true for hash routes. The ``hashchange`` event is fired even when new history entry is created. To the most part JQuery router relies on history API. However, as hash routes are integral part of browser routing, we have added some elements of our own to provide proper cross browser support. For example, custom ``popstate`` event is fired on creation of new history. And there you go! That's why your code behaves weird.<br/>
Think of JQuery router in terms of browser events. When an event is triggered, you expect that event handler to be executed. Similarly, when a route is added or changed, the route handler is executed.
```js
/**
 * Events
 */
$(document.body).on('customEvent', handler); // Executed when 'customEvent' is triggered
$(document.body).trigger('customEvent'); // Triggers the handler
/**
 * Routes
 */
$.route('/custom/path', handler); // '/custom/path' is an event for JQuery router and a path for your browser history API
$.router.set('/custom/path'); // Triggers the handler along with changing the browser history
```
