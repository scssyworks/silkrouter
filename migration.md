# Migrating to Silkrouter v6

If you are coming from Silkrouter v4 or later, the migration does not require many changes. Although we have removed the dependency on RxJS, the syntax remains largely the same. Here are the changes you need to make.

# Zero dependency on RxJS

Silkrouter v4 and v5 primarily relied on operators that are not required in v6. We have significantly simplified the API and retained only the features that are most relevant.

```ts
// Before (v4 and v5)
const router = new Router();

router.subscribe(() => {
  /*...*/
});

rouer.pipe(route('/path')).subscribe(() => {
  /*...*/
});

// NOTE: Pre-defined operators were removed in Silkrouter v5. Everything else is same as v4.
```

```ts
// After (v6)
const router = getRouter();

router.subscribe(() => {
  /*...*/
}); // The handler now receives a simplified object containing URL properties and state.

router.route('/path').subscribe(() => {
  /*...*/
});

// NOTE: router.pipe(/*...*/) has been removed in v6
```

# "Navigate" replaces "Set"

The `set` method has been renamed to `navigate` that accepts simpler arguments.

```ts
// Before
router.set('/path');

router.set({
  route: '/path',
  // ... more options
});
```

```ts
// After
router.navigate(
  '/path',
  /* Optional settings */ {
    replace: false, // Boolean flag to switch between replaceState and pushState
    state: 'any', // Accepts any data
  },
);
```

# Removed features like "no match" and "cache"

Silkrouter v4 shipped with a `noMatch` operator that invoked a handler only when none of the other handlers matched. The purpose of this operator was to provide a flexible way to render a 404 page when no route matched. We soon realized that this approach did not scale well. As more routes were attached, the router had to keep track of all of them. Here's a simple implementation of `noMatch` in v6:

```ts
const routes = Object.entries({
  '/path': (url: IHandlerProps) => {
    /*...*/
  },
  '/new/path': (url: IHandlerProps) => {
    /*...*/
  },
  // ...
});

// Attach listeners
for (const [path, fn] of routes) {
  router.route(path).subscribe(fn);
}

// Attach "noMatch" listener
router.subscribe((props) => {
  if (
    !routes.find((entry) => PathUtils.match(entry[0], props.pathname).match)
  ) {
    // No match has been found
  }
});

// "PathUtils" is available as a named export from "silkrouter/web" and supports matching routes with parameters.
```

Silkrouter v4 shipped with another operator called `cache`. The purpose of this operator was to perform a deep comparison of the previous and next props to avoid invoking the handler unnecessarily. We have since changed the internal architecture of Silkrouter, and this caching logic is no longer needed.
