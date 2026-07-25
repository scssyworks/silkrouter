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

# Dropped features like "no match" and "cache"

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

Silkrouter v4 also shipped with an operator called `cache`. Its purpose was to perform a deep comparison of the previous and next props to avoid invoking handlers unnecessarily. However, this was an afterthought and was never a core concept or goal of the library. As a result, it was removed in v5. If you still find this feature important, you can achieve the same behavior with two lines of code using `lodash`.

```ts
router.subscribe((props) => {
  if (!cache || !_.isEqual(cache, props)) {
    cache = props;
    // ...
  }
});
```

It is important to understand why we dropped this feature in the first place. This approach works only when the order of query string and path parameters remains the same. Otherwise, more complex logic is required to evaluate deep equality. The `cache` operator relied on third-party libraries to achieve this, which increased the bundle size. As a result, we decided to leave this responsibility to the frameworks that consume the Silkrouter API.
