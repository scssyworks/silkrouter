# Debugging

## Routes execute twice for hash routes

This occurs if normal and hash routes are same (E.g.: ``https://example.com/path/to/route#/path/to/route``). Therefore, route listener executes twice for this scenario. To fix this you can either use ``e.hash`` flag or switch to hash routing.

```js
route('#/path/to/route', () => { ... });
```

## Silkrouter throws "Invalid route" error

Silkrouter validates route strings and support routes that are valid for URL. If route string is invalid, you might get "Invalid route" error.

### Valid route

```js
route('/valid/route', ...); // A valid route starts with '/'
```

### Invalid route

```js
route('invalidRoute', ...);
```

## Trying to remove list routes removes all generic routes

List routes are generic routes.

```js
route([ ... ], () => { ... });
// Is equivalent to
route((e) => {
    switch(e.route) { ... }
});
```

Silkrouter registers a generic route, and hence the only way you can remove a list route is by passing route handler.

```js
unroute([...]); // This will unroute all generic routes
unroute([...], fn); // This will unroute the specific handler
```

Please note that list routing is experimental.
<hr>
<b>Edit:</b> As of version 3.4.6 simply passing a list route will not remove generic routes. To remove a list route you need to pass the handler.