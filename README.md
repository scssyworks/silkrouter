[![Build Status](https://travis-ci.org/scssyworks/silkrouter.svg?branch=master)](https://travis-ci.org/scssyworks/silkrouter) ![GitHub](https://img.shields.io/github/license/scssyworks/silkrouter) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.min.js?label=minified) ![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.js?label=unminified)

**If you are searching for version 3 documentation (current version), please click on the link below:**<br>
https://github.com/scssyworks/silkrouter/blob/master/READMEv3.md

# Silk router

Silk router is a reactive app routing library.

# Install

```sh
npm install --save silkrouter rxjs
```

# What's new?

Silk router uses the new `Observer` pattern compared to `EventEmitter` pattern in previous versions. Almost 80% of the code has been re-written. You can use a bunch of operators provided by `rxjs` and `silkrouter` along with your own.

# RxJS

Silk router uses classes such as `Observables` and `Subscription` provided by `rxjs`. We do not bundle them to keep file size small. You need to install `rxjs` separately.

# How to use Silk router

Silkrouter syntax has changed (and for good).

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

3. Add a subscriber

```js
router.subscribe((e) => {
  // This is your new generic route syntax
});
```

4. Use `route` operator to add a path

Use `pipe` method to chain an operator (similar to RxJS)

```js
router.pipe(route('/path/to/route')).subscribe((e) => {
  // This listens to a specific route '/path/to/route'
});
```

5. Trigger a route change

```js
router.set('/path/to/another/route');
```

You can `pipe` as many operators you want. Please refer to API section below for more details.

# API

## Classes

| Class      | Description               | Options and Example                                                                                                                                                                                                                                                                                                                                                  |
| :--------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Router** | Creates a router instance | ` new Router({ /*Router options*/ })`<br><br>Router options:<br><br> **hashRouting**[optional] - Enables hash routing (default: `false`)<br> **preservePath**[optional] - Preserves existing `pathname` when hashRouting is enabled (default: `false`)<br> **context**[optional] - Element reference to bind `vpushstate` synthetic event (default: `document.body`) |

## Router methods

| Method        | Description                              | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| :------------ | :--------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **set**       | Sets browser router path                 | `routerIns.set(pathStringOrObject[, replace][, exec])`<br><br>Set parameters:<br><br> **pathStringOrObject** - String or object to configure current path<br>Examples:<br>`routerIns.set('/example/path')`<br>`routerIns.set({ route: '/example/path', /*...otherOptions*/ })`<br>**replace**[optional] - Use history `replaceState` function instead of `pushState` (default: `false`).<br>**exec**[optional] - Disable or enable subscriber execution (default: `true`)<br><br>Path object options: **route, data, queryString, preserveQuery** (bool)**, pageTitle, replace** (bool)**, exec** (bool) |
| **subscribe** | Returns RxJS subscription                | `routerIns.subscribe(e => { ... })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **pipe**      | Pipes operators to return new observable | `routerIns.pipe(route('/example/route')).subscribe(e => { ... })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| **destroy**   | Destroys current router instance         | `routerIns.destroy(() => { /* Unsubscribe your subscriptions here */ })`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## Operators

| Operator    | Description                                                                      | Example                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| :---------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **route**   | Set a filter for specific route path                                             | `routerIns.pipe(route(path[, routerIns][, ignoreCase])).subscribe(...)`<br><br>`route` options:<br><br> **path** - Path filter to apply on generic route observer<br> **routerIns**[optional] - Current `Router` instance. Required only if `noMatch` operator is used.<br> **ignoreCase**[optional] - Ignores the case of current route                                                                                                                                                                                                                                                                               |
| **deparam** | Converts query string to JS object                                               | **Before:** `routerIns.subscribe(e => { console.log(e.search); })`.<br>Output: **a=10&b=20**<br> **After:** `routerIns.pipe(deparam()).subscribe(e => { console.log(e.search); })`.<br>Output: **{ a:"10", b:"20" }**<br><br>`deparam` options:<br><br> **coerce**[optional] - Converts object properties to their correct types                                                                                                                                                                                                                                                                                       |
| **noMatch** | Adds an optional route for 'page not found'                                      | `routerIns.pipe(noMatch(routerIns)).subscribe(...)`<br><br>`noMatch` options:<br><br> **routerIns** - Router instance for tracking current routes                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **cache**   | Caches event object to call subscribers only if there is a change in URL or data | `routerIns.pipe(cache([keys][, deep])).subscribe(e => { ... })`<br><br>`cache` options:<br>**keys**[optional] - Event object keys which you want to cache and compare<br>**deep**[optional] - Enable deep comparison (By default shallow comparison is used)<br><br>Examples:<br>1. Perform shallow comparison of all keys (excluding event objects)<br>`routerIns.pipe(cache()).subscribe(e => { ... })`<br>2. Perform deep comparison<br>`routerIns.pipe(cache(true)).subscribe(e => { ... })`<br>3. Perform comparison on selected keys<br>`routerIns.pipe(cache(['route', 'data'], true)).subscribe(e => { ... })` |

# Examples

## Enable hash routing

Unlike previous versions of silk router, `hash` routing has to be enabled via flag.

```js
const router = new Router({
  hashRouting: true,
});
```

Your application will continue to run the same way. Hash routing strips away the dependency to define server-side routes for your application (since hash routing is pretty much client-side).<br><br>
By default hash routes replaces your current path. In order to keep the current path, you need to pass an additional flag called `preservePath`.

```js
const router = new Router({
  hashRouting: true,
  preservePath: true,
});
```

## Handle error page

Silk router version 4 brings a neat way to handle error pages using operators. It comes with built-in `noMatch` operator which works as an error handler keeping track of routes that have been added previously, and call subsriber only if a route is missing.

```js
const router = new Router();

router.pipe(route('/first/path', router)).subscribe(() => { ... });
router.pipe(route('/second/path', router)).subscribe(() => { ... });
router.pipe(noMatch(router)).subscribe(() => { ... }); // Called only if "first" and "second" paths are not matched
```

Make sure to pass the current router instance as parameter.

## Passing data

There are three ways you can pass data.

1. Route params
2. Query strings
3. Direct method

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

Please feel free to raise pull requests for new features or existing code fixes. For any queries please reach out to me at contactsachinsingh@gmail.com
