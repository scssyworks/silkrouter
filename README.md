[![Node.js CI](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml/badge.svg)](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml) ![License](https://img.shields.io/github/license/scssyworks/silkrouter) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.min.js?label=minified) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.js?label=unminified)

**For version 3 documentation please click on the link below:**<br>
https://github.com/scssyworks/silkrouter/blob/master/READMEv3.md

# Silk router

Silk router is a reactive app routing library.

# Install

```sh
npm install --save silkrouter rxjs
```

# Dependencies

Silk router uses `Observable` and `Subscription` classes from `rxjs`. You need to install this package separately.

# How to use Silk router?

1. Import

```js
import { Router } from 'silkrouter';
import { route } from 'silkrouter/operators';
...
```

2. Create a router instance

```js
const router = new Router();
```

You can create multiple instances depending on your requirement.

3. Add a subscriber

```js
router.subscribe((e) => {
  // Generic route listener. Listens to every route change.
});
```

4. Add a `route` operator using `pipe` to use path

```js
router.pipe(route('/path/to/route')).subscribe((e) => {
  // Listens to a specific route '/path/to/route'
});
```

5. Trigger a route change

```js
router.set('/path/to/route');
```

You can `pipe` multiple operators at once. Please refer to API section below for more details.

# API

## Classes

| Class      | Description               | Options and Example                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :--------- | :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Router** | Creates a router instance | ` new Router({ /*Router options*/ })`<br><br>Router options:<br><br> **hashRouting**[optional] - Enables hash routing (default: `false`)<br> **preservePath**[optional] - Preserves existing `pathname` when hashRouting is enabled (default: `false`)<br> **context**[optional] - Element reference to bind `vpushstate` virtual event. You can bind your own listener to listen to this event for specific use-cases (default: `document.body`)<br> **init**[optional] - Enable/disable handler execution on initialization (default: `true`) |

## Router methods

| Method        | Description                              | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------ | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **set**       | Sets browser router path                 | `routerIns.set(path[, replace][, exec])`<br><br>Set parameters:<br><br> **path** - String or object to configure current path<br>Examples:<br>`routerIns.set('/example/path')`<br>`routerIns.set({ route: '/example/path', /*...options*/ })`<br>**replace**[optional] - Enables `history.replaceState` to replace current route instead of pushing a new one (default: `false`).<br>**exec**[optional] - Enables or disables handler (default: `true`)<br><br>Path options: **route, data, queryString, preserveQuery** (bool)**, pageTitle, replace** (bool)**, exec** (bool) |
| **subscribe** | Returns RxJS subscription                | `routerIns.subscribe(e => { ... })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **pipe**      | Pipe operators and return new observable | `routerIns.pipe(route('/example/route')).subscribe(e => { ... })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **destroy**   | Destroys current router instance         | `routerIns.destroy(() => { /* Unsubscribe your subscriptions here */ })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Operators

| Operator    | Description                                                                      | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :---------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **route**   | Sets a route filter                                             | `routerIns.pipe(route(path[, routerIns][, ignoreCase])).subscribe(...)`<br><br>`route` options:<br><br> **path** - Route path<br> **routerIns**[optional] - Current `Router` instance. Required if `noMatch` operator has to be used.<br> **ignoreCase**[optional] - Ignores the case of current route                                                                                                                                                                                                                                                                               |
| **deparam** | Converts query string to JS object                                               | **Before:** `routerIns.subscribe(e => { console.log(e.search); })`.<br>Output: **'a=10&b=20'**<br> **After:** `routerIns.pipe(deparam()).subscribe(e => { console.log(e.search); })`.<br>Output: **{ a:"10", b:"20" }**<br><br>`deparam` options:<br><br> **coerce**[optional] - Converts object properties to their correct types                                                                                                                                                                                                                                                                                       |
| **noMatch** | Adds an optional route for 'page not found'                                      | `routerIns.pipe(noMatch(routerIns)).subscribe(...)`<br><br>`noMatch` options:<br><br> **routerIns** - Router instance for tracking current routes                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **cache**   | Caches the event to call subscribers only if there is a change in URL or data | `routerIns.pipe(cache([keys][, deep])).subscribe(e => { ... })`<br><br>`cache` options:<br>**keys**[optional] - Event object keys which you want to cache and compare<br>**deep**[optional] - Enable deep comparison (By default shallow comparison is used)<br><br>Examples:<br>1. Perform shallow comparison of all keys (excluding event objects)<br>`routerIns.pipe(cache()).subscribe(e => { ... })`<br>2. Perform deep comparison<br>`routerIns.pipe(cache(true)).subscribe(e => { ... })`<br>3. Perform comparison on selected keys<br>`routerIns.pipe(cache(['route', 'data'], true)).subscribe(e => { ... })` |

# Examples

## Enable hash routing

Unlike previous versions, `hash` routing has to be enabled via flag.

```js
const router = new Router({
  hashRouting: true,
});
```

Your application will continue to run the same way. Hash routing strips away the dependency to define server-side routes for your application.<br><br>
By default hash route replaces your current path. You need to pass an additional flag called `preservePath` to keep the current path.

```js
const router = new Router({
  hashRouting: true,
  preservePath: true,
});
```

## Handle not found page

Silk router comes with built-in `noMatch` operator that works as an not-found handler.

```js
const router = new Router();

router.pipe(route('/first/path', router)).subscribe(() => { ... });
router.pipe(route('/second/path', router)).subscribe(() => { ... });
router.pipe(noMatch(router)).subscribe(() => { ... }); // Called only if "first" and "second" paths are not matched
```

Make sure to pass the current router instance as second parameter.

## Passing data

There are three ways you can pass data.

1. Route params
2. Query strings
3. Route state

### Route params

```js
...
router.pipe(route('/route/:with/:params')).subscribe(e => {
    console.log(e.params); // --> { with: 'param1', params: 'param2' }
});
...
router.set('/route/param1/param2');
```

### Query string

```js
router.set('/example/route?with=query&string=true');
// OR
router.set({
  route: '/example/route',
  queryString: 'with=query&string=true',
});
```

You can preserve existing query string by passing `preserveQuery` flag.

```js
router.set({
  route: '/example/route',
  queryString: 'with=query&string=true',
  preserveQuery: true, // Default: false
});
```

Query strings are passed to subscriber as `e.search` and `e.hashSearch`parameters (where `e` is an event object) depending on which router mode is enabled. You might get both under certain circumstances.

### Passing data directly

```js
router.subscribe(e => {
    console.log(e.data); // --> Hello World!
});
...
router.set({
    route: '/example/route',
    data: 'Hello World!'
});
```

Similar to route parameters and query strings, data passed this way is also persisted.

# Contribution

Please feel free to raise pull requests for new code fixes and features.
