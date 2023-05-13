[![Node.js CI](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml/badge.svg)](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml)
![License](https://img.shields.io/github/license/scssyworks/silkrouter)
![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.min.js?label=minified)
![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.js?label=unminified)

# Silk router

Silk router is a reactive and light-weight (2.8kb gzipped) routing library.

# [[NOTE]]

Silk router version 5 has dropped support for all the older, reluctant to change
browsers to focus on only the latest and greatest ones. It not only makes
silkrouter faster and lighter, it also allow us tweak the core functionality.

# Install

```sh
npm install --save silkrouter rxjs
```

# Dependencies

Silk router is dependant on `rxjs` for certain classes such as `Observable` and
`Subscription`. You need to install this package separately.

# Usage

1. Import

```js
import { Router } from 'silkrouter';
...
```

2. Create an instance

```js
const router = new Router();
```

3. Add a handler

```js
router.subscribe((e) => {
  // Listens to changes to route
});
```

4. Navigate to a route

```js
router.set("/path/to/route");
```

# Hash routing support

Silkrouter supports hash routing for projects that requires them.

```js
const router = new Router({
  hashRouting: true,
});
```

Hash routing replaces the current path with a hash path by default. To disable
this behaviour (and preserve the current path) you can enable path preservation.

```js
const router = new Router({
  hashRouting: true,
  preservePath: true,
});
```

Path preservation doesn't work if hash routing is disabled.

# Disable initialization

Silkrouter automatically calls the handler on initialization. This behaviour
allow consumers to mount their respective components on page-load. However, in
special scenarios you might just want to initialize the router without making
any changes to the DOM. To do that we can disable initialization.

```js
const router = new Router({
  init: false,
});
```

# Operators

From version 5 onwards, silkrouter doesn't ship any built-in operators. However,
it still has support for RxJS operators similar to version 4. You can create
your operators and use them with silkrouter.

```js
const router = new Router();

router.pipe(myOperator()).subscribe((event) => {
  // ...
});
```

myOperator.js

```js
export function myOperator() {
  return (observable) =>
    new Observable((subscriber) => {
      const currSubscription = observable.subscribe({
        next(value) {
          // ...
          subscriber.next(/* updated value */);
        },
        error: subscriber.error,
        complete: subscriber.complete,
      });
      // ...
      return () => {
        return currSubscription.unsubscribe();
      };
    });
}
```

# Contribution

We invite all of you to contribute to silkrouter and make it better. Please feel
free to fork this repository and raise PRs.
