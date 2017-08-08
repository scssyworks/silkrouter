# JQuery Routing Plugin
JQuery router is a routing plugin for jQuery. It can be used for developing Single Page Applications.

# Installation
You can install jQuery router using npm

<pre><code>
npm install jqueryrouter
</code></pre>

You can also do a bower install as follows

<pre><code>
bower install jqueryrouter
</code></pre>

Or you can download the repository above.

# How to use?
<b>1. Initialize router plugin</b><br/>
<pre><code>
$.router.init();
</code></pre>

<b>2. Add a route handler</b><br/>
A route handler is triggered when a particular route is active. For example, if you navigate to a route "path/to/route", the handler function associated with it get's triggerred. This is useful if you want to render a section of page or simply switch tabs depending on given route.

<pre><code>
$(selector).route(route, handler);
$.route(route, handler);
</code></pre>

<b>Note:</b><code>$.router.init</code> does not execute route handlers (yet). If you wish to render something on page load, make sure that you have attached route handlers before calling <code>init</code>.

<b>3. Set route programmatically</b><br/>
You can always change route manually by updating the URL. But this is just one side of the coin. We need a handle that would allow us to change route when something happens on the page. In other words, we should be able to change route programmatically. Fret not! We have a way.

<pre><code>
$.setRoute(route [, replaceMode [, noTrigger]]);
</code></pre>

<b>Parameters:</b><br/>
<b>route</b>: &lt;string | object&gt;<br/>
You can pass a string if you wish not to pass data. Otherwise, you need to construct a route object (e.g. <code>$.setRoute({ route: "path/to/route", data: { ... } });</code>).<br/>
<b>replaceMode</b>: &lt;boolean&gt;<br/>
By default setRoute updates the browser history. If you want to prevent that, set replaceMode to <code>true</code>.<br/>
<b>noTrigger</b>: &lt;boolean&gt;<br/>
By default setRoute triggers the route handler. If you want to change the route without executing route handler, set noTrigger to <code>true</code>.<br/>
JQuery router uses history API and provides additional support for IE9 since it does not support <code>pushState</code>. It uses a custom event to trigger route handlers, hence triggering <code>popState</code> and <code>hashChange</code> events will have little or no effect. If you want to trigger a route handler without calling <code>setRoute</code>, the recommended way is follows: 
<pre><code>$.router.events.trigger($.router.events.routeChanged)</code></pre>.
  
Jquery router is supported by all major desktop and mobile browsers.

This is still not a major release hence use JQuery router at your own risk.
