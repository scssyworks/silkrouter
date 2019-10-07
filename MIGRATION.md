# Welcome to Silkrouter migration documentation

This documentation has been created to help you migrate to the newest version of ``Silkrouter``.<br><br>

Silk router was created to solve certain issues with jQuery router, and also leverage some of the latest features provided by ``history`` API out of the box. As a result, silk router has dropped support of some of the legacy browsers (such as IE9).<br><br>

Let's talk about some of the issues jQuery router had:<br>

## Dependency on ``router.init`` method
JQuery router uses ``router.init`` method to trigger routes on page load. Although it did have some advantages like user could choose when to initialize routes, however in most cases developers ended up writing following piece of code (especially for ``hash`` routing).

```js
if (location.hash) {
    $.router.init();
} else {
    $.router.set({
        route: '#/path/to/route'
    });
}
```

This was worse when ``router.init`` did not keep track of handlers that were already executed before. Developers were forced to call ``router.init`` from a common place. This issue was however solved in version 2.2.0.<br><br>

Silk router has removed ``router.init`` method. Matching route handlers are called as soon as they are attached. This simplistic approach reduces tonnes of code as well as errors.

## Lack of data persistence

Jquery router supports IE9 and rely on ``hashchange`` event. As a result it was difficult for jQuery router to leverage ``PopStateEvent`` state object to persist data. Since ``silkrouter`` does not support IE9, this is no longer an issue.<br>

jQuery router:
```js
$.router.set({
    route: '...',
    data: { ... } // <-- This data is not persisted
});
```

Silk router:
```js
import { router } from 'silkrouter';
router.set({
    route: '...',
    data: { ... } // <-- This data is persisted
});
```

Persisting data is a huge deal as developers can now completely rely on ``silkrouter`` instead of implementing their own solutions to persist data.

## Popstate vs Hashchange and Pop to Hash switching in old browsers 

Pop state and hash change events work differently. For example ``popstate`` event is not fired on new history pushes. Hash change on the other hand is fired even for the new pushes. This poses a problem for older browsers using push state feature. JQuery router has to fallback to ``hashchange`` to support routing. JQuery router can handle this scenario very well. The problem occurs if you are using a combination of normal and hash routes. JQuery router cannot handle it because normal routes are hash routes in older browsers.

## Dependency on jQuery

JQuery router (as the name already suggests) is dependent on jQuery. Which means, you cannot use it in non jquery projects.

# How to migrate?

Since we have addressed most common issues, migrating to ``silkrouter`` should be easy. In next few sections we will discuss the points that should be taken care of when migrating to the newest version.

## When to migrate?

If you are still supporting older browsers like IE9, migrating to ``silkrouter`` would be a bad idea. Just upgrading to the latest version of jquery router should suffice. However, if supporting legacy browsers is no longer your priority, you should upgrade to the latest version of ``silkrouter``.

## Code changes required to upgrade to silkrouter

1. Remove ``router.init``
2. Objects ``query`` and ``params`` are no longer separate arguments. They are now part of route event object.

```js
route(e => {
    const { params, query } = e;
});
```

3. Data object is no longer merged with route object. It is available as a separate ``data`` object.

jQuery router
```js
$.route('...', e => {
    const { h } = e;
    console.log(h); // -> 'Hello World'
});

$.router.set({
    route: '...',
    data: {
        h: 'Hello World'
    }
});
```

Silk router
```js
route(e => {
    const { h } = e.data;
    console.log(h);
});

router.set({
    route: '...',
    data: {
        h: 'Hello World'
    }
});
```

## Detecting manual vs browser events

Since jQuery router does not persist data, it was easy for developers to detect manual vs browser events. Imagine a bug working as feature for some users:

```js
$.route('*', e => {
    const { fromCode } = e;
    if (fromCode) {
        // Do something
    }
});

$.router.set({
    ...
    data: {
        fromCode: true
    }
});
```

Silkrouter persists this data, which means this code will break. However, you can easily change this to following:

```js
route(e => {
    const fromCode = !(e.originalEvent instanceof PopStateEvent);
    if (fromCode) {
        // Do something
    }
});
```

