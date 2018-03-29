# JQuery Routing Plugin
JQuery router is a web routing plugin created to support single page applications.

# Installation

<pre><code>npm install jqueryrouter</code></pre>


# How to use?
<b>1. Create routes</b><br/>
<pre><code>$.route('/path/to/route1', function () { ... });
$.route('/path/to/route2', function () { ... });
$.route('/path/to/route3', function () { ... });</code></pre><br/>
<b>2. Trigger a route by calling <code>$.router.set</code></b><br/>
<pre><code>$.router.set('/path/to/route1')</code></pre><br/>
The method changes the current route and call the appropriate method that matches it.
<b>3. Want to execute routes on page load? Call the router's <code>init</code> method for magic</b><br/>
<pre><code>$.router.init();</code></pre>
The method execute handler methods that matches the current route (without <code>$.router.set</code>). Alternatively, you can call <code>$.router.set(location.pathname);</code> on DOM ready.
<pre><code>$(function () {
    ...
    $.router.set(location.pathname);
});</code></pre><br/>
<b>4. Pass data to route handler:</b><br/>
<pre><code>$.router.set({
    route: '/path/to/route',
    data: <b>{
        key1: value1,
        key2: value2
    }</b>>
});
...
$.route('/path/to/route', function (<b>data</b>) {
    console.log(<b>data.key1</b>); // value1
    console.log(<b>data.key2</b>); // value2
});</code></pre></pre>
<b>5. Set route parameters:</b><br/>
<pre><code>$.router.set('/path/to/route/<b>hello</b>/<b>world</b>');
...
$.route('/path/to/route/<b>:param1</b>/<b>:param2</b>', function (data, <b>params</b>) {
    console.log(<b>params.param1</b>); // hello
    console.log(<b>params.param2</b>); // world
});</code></pre><br/>
<b>6. Set query parameters:</b><br/>
<pre><code>$.router.set({
    route: '/path/to/route',
    <b>queryString: 'q=123&s=helloworld'</b>
});
...
$.route('/path/to/route', function (data, params, <b>query</b>) {
    console.log(<b>query.q</b>); // 123
    console.log(<b>query.s</b>); // 'helloworld'
});</code></pre><br/>
<b>7. Change current page path without updating history:</b><br/>
<pre><code><b>var replaceMode = true;</b>
$.router.set('/path/to/route', <b>replaceMode</b>);</code></pre><br/>
<b>8. Change current page path without calling handler function:</b><br/>
<pre><code>...
<b>var doNotCallHandler = true;</b>
$.router.set('/path/to/route', replaceMode, <b>doNotCallHandler</b>);</code></pre><br/>
<b>9. Set \# routes:</b><br/>
<pre><code>$.router.set(<b>'#/path/to/route'</b>);
...
$.route('/path/to/route', function () {
    console.log('Still works');
})</code></pre><br/>
This forces plugin to change URL hash instead of pathname.<br/>

# Browser support
Jquery router supports all major desktop and mobile browsers including IE9.

# Debugging
<b>1. Differentiating between \# and pathname if both are same:</b><br/>
In certain scenarios modern browsers trigger both <code>hashchange</code> and <code>popstate</code> events when URL hash is updated. This causes route handler to execute twice when both \# and pathname are same.
Example: http://example.com/path/to/route#/path/to/route
<pre><code>$.route('/path/to/route', function () {
   console.log('Executed twice');
});</code></pre><br/>
Simply add a safety check to identify which is which:
<pre><code>$.route('/path/to/route', function (<b>data</b>) {
    if (data.<b>hash</b>) {
        console.log('Executes on hashchange');
    } else {
        console.log('Executes on popstate');
    }
});</code></pre><br/>

# Demo
https://jqueryrouter.herokuapp.com/
