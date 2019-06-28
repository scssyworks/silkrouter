# Debugging

<b>1. Differentiating between \# and pathname if both are same:</b><br/>
SILK router will execute route handler twice if both ``pathname`` and ``hash`` are same.
Example: http://example.com/path/to/route#/path/to/route
```js
route('/path/to/route', function () {
   console.log('Executed twice');
});
```
To prevent double execution use hash route or implement following check:
```js
route('#/path/to/route', function () {
    console.log('Executes only for hash changes');
});
route('/path/to/route', function (e) {
    if (e.hash) {
        console.log('Executes for hash changes');
    } else {
        console.log('Executes for normal route changes');
    }
});
```

<b>2. SILK router throws an "invalid route" error</b><br/>
SILK router validates the path. A valid path starts with a ``/``
```js
route('/path/to/route', function () { ... }); // Correct
route('path/to/route', function () { ... }); // Incorrect
```

<b>3. How to handle error scenarios such as missing routes?</b><br/>
This is a common use case where you want to render an error page if the route doesn't exist. You can use generic route handler to handle this scenario.

```js
route(function (e) {
    if (...) {
    } else if (...) { 
    } else {
      // If none of the conditions matched then render error page
      // ...
    }
});
```

<b>4. How to ``unroute`` a list route?</b><br/>
This is a problem you are going to face if you are using a list route. Currently SILK router uses generic route under the hood to handle route lists. This is what happens:
```js
route(['/', '/testroute'], function () { ... });
// Is equivalent to
route(function (e) {
    switch(e.route) {
        case '/': ...
        case '/testroute': ...
        default: ...
    }
});
```
Therefore the route that is attached is generic route ("*") instead of a list. This is done to achieve better performance.<br/>
This doesn't mean that you can't ``unroute`` a list route. One way is to call ``unroute`` without any parameters which basically unroutes everything (not recommended). A better way is to pass the original handler function:
```js
function handler() { ... }
route(['/', '/testroute'], handler);
...
unroute(handler); // Works
```
Note that you need to store the reference of your handler function somewhere in order to make it work.<br/>
<b>Disclaimer:</b> List routing is still experimental.