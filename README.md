# JQuery Routing Plugin
JQuery router is a routing plugin for jQuery used for developing Single Page Applications.

# Installation

<b>NPM:</b><br/>
<pre><code>npm install jqueryrouter</code></pre>

<b>Bower:</b><br/>
<pre><code>bower install jqueryrouter</code></pre>

<b>Download:</b><br/><br/>
Use <code>Clone or download</code> option above.

# How to use?
<b>1. Initialize router plugin</b><br/>
<pre><code>$.router.init();</code></pre>
This step is used to execute route handlers on page load. 
Calling init method is not mandatory. It is only used if a route handler needs to be called on page load.

<b>2. Add a route handler</b><br/>
A route handler is triggered when a particular route is active. For example, if you navigate to a route "path/to/route", the handler function associated with it get's triggerred. This is useful if you want to render a section of page or simply switch tabs depending on given route.

<pre><code>$(selector).route(route, handler);
$.route(route, handler);</code></pre>

<b>Note:</b><code>$.router.init</code> does not execute route handlers which are added after the <code>init</code> call. Make sure that you have attached handlers beforehand.

<b>3. Set route programmatically</b><br/>
You can always change route manually by updating URL. But this is just one side of the coin. We need a handle which would allow us to change route when something happens on page. In other words, we should be able to change route programmatically. Don't worry! We have a solution.

<pre><code>$.setRoute(route [, replaceMode [, noTrigger]]);</code></pre>

<b>Parameters:</b><br/>
<b>route</b>: &lt;string | object&gt;<br/>
You can pass a string if you do not wish to pass data. Otherwise, you need to construct a route object (e.g. <code>$.setRoute({ route: "path/to/route", data: { ... } });</code>).<br/>
<b>replaceMode</b>: &lt;boolean&gt; | optional<br/>
By default setRoute updates the browser history. If you want to prevent that, set replaceMode to <code>true</code>.<br/>
<b>noTrigger</b>: &lt;boolean&gt; | optional<br/>
By default setRoute triggers the route handler. If you want to change the route without executing route handler, set noTrigger to <code>true</code>.<br/>

# Dynamic routes (added in v0.2.1)
Routes with parameters are defined as follows:
<pre><code>$(selector).route("/path/to/route/<b>:param1</b>/<b>:param2</b>", function (data, params) { ... });
$.setRoute("/path/to/route/<b>value1</b>/<b>value2</b>");
</code></pre>

Parameters are received in <code>params</code> object which is second argument in callback function.

# Query Parameters (added in v0.3.0)
Query parameters can be passed as query string to the <code>setRoute</code> function. JQuery router automatically appends query string to the route. For IE9 this behavior is slightly different. The querystring gets appended to hash route instead of route since IE9 doesn't support <code>pushState</code>. 

JQuery router parses the querystring into an object with the help of <a href="https://github.com/scssyworks/jquerydeparam">deparam plugin</a> and passes it as a third parameter to the route handler.

<pre><code>$(selector).route("/path/to/route", function (data, params, <b>query</b>) { ... });
$.setRoute({
    route: "/path/to/route",
    <b>queryString: "param1=value1&amp;param2=value2"</b>
});
</code></pre>

# Summary
JQuery router uses history API and provides additional support for IE9 since it does not support <code>pushState</code>. It uses a custom event to trigger route handlers, hence triggering <code>popstate</code> and <code>hashchange</code> will not work properly. Though it might work in few cases, it is not a recommended way. 
If you want to trigger a route handler without calling <code>setRoute</code>, the best way is to use custom <code>routeChanged</code> event: 
<pre><code>$.router.events.trigger($.router.events.routeChanged);</code></pre>
  
Jquery router is supported by all major desktop and mobile browsers.

There are no major releases yet, hence use JQuery router at your own risk.
