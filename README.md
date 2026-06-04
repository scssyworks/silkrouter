# Silkrouter

Silkrouter is a light-weight (&lt;2kb gzipped) and reactive routing library.

# Installation

```sh
npm i --save-exact silkrouter
```

# API

Silkrouter has been rewritten in TypeScript and has a relatively simple API.

## Instantiate

```ts
import { getRouter } from 'silkrouter/web';

const router = getRouter();
```

## Attach

```ts
// Listen to all routes
router.subscribe(() => { ... });

// Listen to /path route
router.route('/path').subscribe(() => { ... });
```

## Trigger

```ts
router.navigate('/path');
```

For a detailed documentation and step-by-step tutorial please visit: https://silkrouter.dev

# Migration

If you are using an older version of `silkrouter` then please visit <a href="https://github.com/scssyworks/silkrouter/blob/master/migration.md">migration</a> documentation for more details.

# Support

We recommend upgrading to latest version of silkrouter. However, we will continue to support `silkrouter` v4 and higher. We have completely dropped support for `silkrouter` v3 and older.
