# JQuery Routing Plugin
JQuery router is a routing plugin for creating Single Page Applications.

# Installation

<b>NPM:</b><br/>
<pre><code>npm install jqueryrouter</code></pre>

<b>Bower:</b><br/>
<pre><code>bower install jqueryrouter</code></pre>

or simply clone the repository.

# How to use?
<b>1. Initialize router plugin</b><br/>
<pre><code>$.router.init();</code></pre>
This step is used to execute route handlers on page load. 
Calling init method is not mandatory. It is used only when a route handler needs to be called on page load.

<b>2. Add a route handler</b><br/>
A route handler is a function that executes when a route is activated. For example, if you navigate to a route "path/to/route", the handler associated with it gets called.

<pre><code>$(selector).route(route, handler);
$.route(route, handler);</code></pre>

<b>Note:</b><code>$.router.init</code> does not execute handlers which are added after the initialization. Make sure that the handlers are attached before the <code>init</code> call.

<b>3. Set route</b><br/>
You can always change route manually by updating URL in address bar. JQuery router also provides with options to change route from code. You can use the the old and conventional <code>$.setRoute</code> method,
or the new <code>$.router.set</code>.

<pre><code>$.setRoute(route [, replaceMode [, noTrigger]]);
$.router.set(route, [, replaceMode [, noTrigger]]);</code></pre>

Both <code>$.setRoute</code> and <code>$.router.set</code> works in exact same way. However, there will be no future updates to <code>$.setRoute</code> method. It is there only for backward compatibility.

<b>Parameters:</b><br/>
<b>route</b>: &lt;string | object&gt;<br/>
You can pass a string if you do not wish to pass data. Otherwise, you need to construct a route object (e.g. <code>$.setRoute({ route: "path/to/route", data: { ... } });</code>).<br/>
<b>replaceMode</b>: &lt;boolean&gt; | optional<br/>
By default setRoute updates the browser history. If you want to prevent that, set replaceMode to <code>true</code>.<br/>
<b>noTrigger</b>: &lt;boolean&gt; | optional<br/>
By default setRoute executes the route handler. If you want to prevent that, set noTrigger to <code>true</code>.<br/>

# Dynamic routes (added in v0.2.1)
Routes with parameters are defined as follows:
<pre><code>$(selector).route("/path/to/route/<b>:param1</b>/<b>:param2</b>", function (data, params) { ... });
$.setRoute("/path/to/route/<b>value1</b>/<b>value2</b>");
</code></pre>

Parameters are received in <code>params</code> object which is second argument in callback function.

# Query Parameters (added in v0.3.0)
Query parameters can be passed as query string to the <code>setRoute</code> function. JQuery router automatically appends query string to the route. For IE9 this behavior is slightly different. The querystring is appended to hash route instead of route due to lack of <code>pushState</code> support. 

JQuery router uses <a href="https://github.com/scssyworks/jquerydeparam">deparam plugin</a> to parse the query string and passes it as a third parameter to the route handler.

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

<a href="https://jqueryrouter.herokuapp.com/">DEMO</a>
