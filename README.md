[![Node.js CI](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml/badge.svg)](https://github.com/scssyworks/silkrouter/actions/workflows/node.js.yml)
![License](https://img.shields.io/github/license/scssyworks/silkrouter)
![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.min.js?label=minified)
![GitHub file size in bytes](https://img.shields.io/github/size/scssyworks/silkrouter/dist/esm/silkrouter.esm.js?label=unminified)

# Silk router

Silk router is a reactive and light-weight (1.5kb gzipped) routing library.

# Installation

```sh
npm install --save silkrouter rxjs
```

Silk router is dependant on `rxjs` for classes such as `Observable` and
`Subscription`. Please install this package as a separate (peer) dependency.

# Usage

1. Import `Router` class

```js
import { Router } from 'silkrouter';
...
```

2. Create an instance

```js
const router = new Router();
```

3. Add a `route` handler

```js
router.subscribe((e) => {
  // Listens to changes to route
});
```

4. Navigate to a `route`

```js
router.set("/path/to/route"); // Route should always start with a '/'
```

# Hash router

Silkrouter also adds `hash` routing capability. Hash routes are useful when
back-end doesn't have a way to support page paths. Hash routing can be enabled
via `hashRouting` flag.

```js
const router = new Router({
  hashRouting: true,
});
```

Please note that silkrouter replaces the current path with a hash path by
default. To disable this behaviour you need to preserve the current path.

```js
const router = new Router({
  hashRouting: true,
  preservePath: true,
});
```

Path preservation only works for hash routing.

# Disable initialization

Silkrouter automatically calls the handler as soon as it is attached. This
behaviour allow consumers to mount components on page load. To attach the
listeners silently, you can disable this behaviour.

```js
const router = new Router({
  init: false,
});
```

Please note that disabling initialization doesn't effect the routing
functionality. Route changes are still caught by the handlers.

# Operators

From version 5 onwards `silkrouter` does not ship its own operators. You can
create your own operators as needed, or use the ones built by the awesome
JavaScript community.

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

We invite you all to contribute to `silkrouter` and make it better. Please feel
free to open discussions, fork this repository and raise PRs.
