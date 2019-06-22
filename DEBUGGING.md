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
SILK router checks for valid paths. A valid path starts with a ``/``
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
