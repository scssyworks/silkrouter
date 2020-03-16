# Welcome to Silkrouter migration documentation

Silkrouter has two versions:

1. Silkrouter version 3 (Stable release)
2. Silkrouter alpha version 4 (Unstable release)

We have divided this documentation in two parts to help you migrate to the latest versions. For any queries please feel free to log an issue under ``issues`` tab.

## Migrating to version 3

Silkrouter version 3 evolved from jQuery router. It's practically the same in terms of syntax. There are few changes that are important from perspective of migration. We have listed them down below.

### Init method is gone

The purpose of ``init`` method was to initialize router and execute listeners (that were already attached) on page load. This method was added to support old browsers like IE9 (that lack native support for history API). The new implementation switches to reactive routes (handlers that execute on their own when conditions are met).

Old implementation
```js
import { router, route } from 'jqueryrouter';

route(() => { ... });
route('/path/...', () => { ... });

router.init(); // Manually trigger event
```

New implementation

```js
import { router, route } from 'silkrouter';

route(() => { ... }); // Triggered as soon as listener is attached
route('/path/...', () => { ... }); // Triggered as soon as listener is attached if the path matches the URL
```

### Silkrouter does not use jQuery

JQuery router

```js
import 'jqueryrouter';

$.router.set('...'); // Works
```

Silkrouter

```js
import 'silkrouter';

$.router.set('...'); // Doesn't work
```

To use silkrouter with jQuery you need to do something like this:

```js
import { router, route } from 'silkrouter';
import $ from 'jquery';

Object.assign($, { router, route });

$.router.set('...'); // Works
```

However we don't recommend this approach.

## Migrating to version 4

Silkrouter version 4 is an alpha release. At this moment we don't recommend version 4 for production applications. However, if you still wanna try, here are few changes you should be aware of:

Trigger
```js
$.router.set('...');
// Becomes
const router = new Router(); // Import "Router" from "silkrouter" package
router.set('...');
```

Listen
```js
$.route(() => { ... });
$.route('...', () => { ... });
// Becomes
const router = new Router(); // Import "Router" from "silkrouter" package
...
router.subscribe(() => { ... });
router
    .pipe(route('...')) // Import "route" from "silkrouter/operators" package
    .subscribe(() => { ... });
```