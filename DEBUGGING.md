# Debugging

<b>1. Differentiating between \# and pathname if both are same:</b><br/>
Silk router will execute route handler twice if both ``pathname`` and ``hash`` are same.
Example: http://example.com/path/to/route#/path/to/route
```js
route('/path/to/route', function () {
   console.log('Executed twice');
});
```
To prevent double execution, implement following check:
```js
route('/path/to/route', function (e) {
    if (e.hash) {
        console.log('Executes for hash route');
    } else {
        console.log('Executes for a normal route');
    }
});
```

<b>2. Silk router throws an "invalid route" error</b><br/>
Silk router checks for valid paths and a valid path always starts with a ``/``.
```js
route('/path/to/route', function () { ... }); // Correct
route('path/to/route', function () { ... }); // Incorrect
```

<b>Note:</b> With current version, we are in a process of making this library less error prone and more flexible to use. For that we need your support and contribution.