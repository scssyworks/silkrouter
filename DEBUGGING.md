# Debugging

<b>1. Differentiating between \# and pathname if both are same:</b><br/>
In modern browsers both <code>hashchange</code> and <code>popstate</code> events are triggered when URL hash is updated. This causes route handler to execute twice if \# URL and pathname are same.
Example: http://example.com/path/to/route#/path/to/route
```js
$.route('/path/to/route', function () {
   console.log('Executed twice');
});
```
Route config passes a flag called ``hash`` which sets to ``true`` when ``hashchange`` event is triggered. This can be used as a safety check:
```js
$.route('/path/to/route', function (config) {
    if (config.hash) {
        console.log('Executes on hashchange');
    } else {
        console.log('Executes on popstate');
    }
});
```

<b>2. My routes are not working</b><br/>
JQuery router plugin does a ``path`` validation on existing routes. A correct path always starts with a ``/``.
```js
$.route('/path/to/route', function () { ... }); // Correct
$.route('path/to/route', function () { ... }); // Incorrect
```
<b>3. I am adding too many routes for same function</b><br/>
JQuery router comes with an option to set a generic route.
```js
$.route(function (data) {
    if (data.route === '/path/to/route') {
        console.log('Just works!');
    }
});
```

<b>4. JQuery router is executing handlers unexpectedly!</b><br/>
JQuery router relies of browser's ``history`` API and some of it's functionality is directly dependent on the way history API works. For example ``popstate`` event is fired only when when using browser's ``back`` and ``forward`` arrow buttons. When a new history state is added, this event does not work. Same is not true for ``hashchange`` event. The library fallbacks to ``hashchange`` approach (to provide crosss-browser support) and tries to bridge gaps between the way ``popstate`` and ``hashchange`` works. Since the library is still in beta version, you might find some inconsistencies. Please feel free to log a bug in case you are facing any issues.