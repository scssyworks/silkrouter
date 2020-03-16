# JQuery Routing Plugin
JQuery router is a SPA (Single Page Apps) router plugin for jQuery.

# Upgrade to Silkrouter (Recommended)
``Silkrouter`` is latest recommended version. Refer to <a href="https://github.com/scssyworks/silkrouter/blob/feature/ver2/MIGRATION.md">migration documentation</a> to migrate to this version.

# Installation

Using npm:

```sh
npm install --save jqueryrouter deparam.js jquery
```

Using CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/jqueryrouter@2.2.6/dist/js/jquery.router.min.js"></script>
```

# How to use?
JQuery router follows event emitter pattern similar to ``jQuery`` custom events.

## Bind router events

```js
import $ from 'jquery';
import 'jqueryrouter';

$.route('/path/to/route', (e) => {
    ...
});
$.route('#/path/to/route', (e) => {
    ...
});
```

## Trigger router event

```js
$.router.set('/path/to/route');
// OR
$.router.set({
    route: '/path/to/route'
});
```

## Generic router

JQuery router allows you to attach a listener that listens to all changes in history.

```js
$.route('*', (e) => {
    switch(e.route) {
        '/path/to/route': ...;
        ...
    }
});
// OR
$.route((e) => {
    switch(e.route) {
        '/path/to/route': ...;
        ...
    }
});
```

<b>Note:</b> You need to attach handlers before you can trigger router events.

## Hash router check
If normal and hash routes are same, route handler to executed twice. You can check the event source using ``e.hash``:

```js
$.route('...', (e) => {
    if (e.hash) { ... }
});
```

## Trigger route handlers on page load/reload
To trigger route handlers on page load/reload, you need to call ``router.init`` method.

```js
$.router.init();
```

The ``init`` method keeps track of handlers which have triggered before. If a handler is called before, it is not called again.

## Persisting data

Via query string:
```js
$.route('/path/to/route', (e, params, query) => {
    console.log(query); // -> { h: 'Hello World' }
});

$.router.set({
    route: '/path/to/route',
    queryString: 'h=Hello World'
});
```

Via route params:
```js
$.route('/path/:to/:route', (e, params, query) => {
    console.log(params); // -> { to: 'value1', route: 'value2' }
});

$.router.set({
    route: '/path/value1/value2'
});
```

## Passing data one time
JQuery router allows you to pass data directly to handler. This data is not persisted in ``jQuery`` version due to limitations of IE9.

```js
$.router.set({
    route: '/path/to/route',
    data: { ... } // Data should be a valid object
});
```

# Browser support
Jquery router has been tested in browsers below:
<b>Desktop:</b> IE 9 - 11, Chrome, Firefox, Safari, Opera, Edge
<b>Mobile:</b> Chrome, Safari, Firefox

# Debugging
<a href="https://github.com/scssyworks/silkrouter/blob/feature/ver2/DEBUGGING.md">Debugging</a>

# Demo
https://jqueryrouter.herokuapp.com/
