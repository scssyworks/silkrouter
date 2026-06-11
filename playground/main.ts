import { createEmitter, getRouter } from '../src/web/main';
import './main.css';
import { render } from './utils/render';
import { setMeta } from './main.utils';

const $body = createEmitter(document.body);

const mainPaths: Record<string, string> = {
  home: '/',
  install: '/install',
  setup: '/setup',
  navigation: '/navigation',
  configure: '/configure',
  data: '/data/10/20?q=123&r=456',
  roadmap: '/roadmap',
  cleanup: '/cleanup',
  events: '/events',
};

const pathOrder = [
  mainPaths.home,
  mainPaths.install,
  mainPaths.setup,
  mainPaths.navigation,
  mainPaths.configure,
  mainPaths.data,
  mainPaths.cleanup,
  mainPaths.events,
  mainPaths.roadmap,
];

const router = getRouter();

// `setMeta` is provided by `./main.utils` — it updates title/meta/canonical tags on navigation.

$body.on('click', (event) => {
  const evt = event.originalEvent as MouseEvent;
  const btn = (evt.target as HTMLElement).closest('button');
  if (btn && btn.id === 'back') {
    const prevPathIdx =
      pathOrder.findIndex((p) => p.startsWith(router.location.pathname)) - 1;
    if (prevPathIdx >= 0) {
      router.navigate(pathOrder[prevPathIdx]);
    }
    return;
  }
  if (btn && mainPaths[btn.id]) {
    router.navigate(mainPaths[btn.id]);
  }
});

router.route('/').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Home',
    description:
      'Silkrouter is a light-weight (<2kb gzipped) and reactive routing library.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/',
  });

  render(`
  <section>
    Silkrouter has been developed with one idea in mind: <b>simplicity</b>. It has an easy-to-use API that can be used with any CSR library or framework. SSR support will be added soon.
  </section>
  <section>
    This demo is designed as a step by step interactive demo that will guide you through the core concepts of Silkrouter.
  </section>
  <section>
    To start please click on the <b>Next</b> button below.
  </section>
  <section>
    <button id="install">Next: Installation >></button>
  </section>
  `);
});

router.route('/install').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Installation',
    description: 'Installation instructions for Silkrouter via NPM.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/install',
  });

  render(`
  <section>
    Silkrouter is available for installation via NPM
  </section>
  <pre>npm i --save-exact silkrouter@canary-6</pre>
  <section>
    <b>Note:</b> Starting with <b>v6</b>, Silkrouter does not rely on any third-party libraries, favoring native Web APIs instead.
  </section>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="setup">Next: Setup &gt;&gt;</button>
  </section>
  `);
});

router.route('/setup').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Setup',
    description: 'Quickstart and setup guide for Silkrouter.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/setup',
  });

  render(`
  <section>
    Silkrouter is easy to setup and use.
  </section>
  <pre><code>
  <span id="cmt">// Import</span>
  <span id="kw">import</span> { getRouter } <span id="kw">from</span> <span id="str">'silkrouter/web'</span>;

  <span id="cmt">// Instantiate</span>
  <span id="kw">const</span> router = <span id="fc">getRouter</span>();

  <span id="cmt">// Subscribe to * (all path changes)</span>
  <span id="kw">const</span> unsub = router.<span id="prop">subscribe</span>((r) <span id="sym">=></span> {
    console.<span id="prop">log</span>(r.<span id="prop">pathname</span>);

  <span id="cmt">// Subscribe to /path</span>
  <span id="kw">const</span> unsub2 = router.<span id="prop">route</span>(<span id="str">'/path'</span>).<span id="prop">subscribe</span>((r) <span id="sym">=></span> {
    console.<span id="prop">log</span>(r.<span id="prop">pathname</span>);
  });
  </code></pre>
  <section>
  Silkrouter implements an observer-style API for subscribing to path changes. It does not implement the TC39 Observable proposal or RxJS Observable interfaces. Handlers subscribe to specific paths and are invoked immediately only when the current browser path matches the subscribed path.
  </section>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="navigation">Next: Navigation &gt;&gt;</button>
  </section>
  `);
});

router.route('/navigation').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Navigation',
    description: 'Navigation API and examples for Silkrouter.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/navigation',
  });

  render(`
  <section>
    Silkrouter provides a simple API for navigating to different paths.
  </section>
  <pre><code>
  <span id="cmt">// Navigate to /path</span>
  router.<span id="prop">navigate</span>(<span id="str">'/path'</span>);

  <span id="cmt">// Navigate with state</span>
  router.<span id="prop">navigate</span>(<span id="str">'/path'</span>, {
    replace: <span id="kw">true</span>, <span id="cmt">// Replace current history entry instead of adding a new one</span>
    state: { some: <span id="str">'state'</span> },
  });
  </code></pre>
  <section>
    The navigate method allows you to navigate to a different path and call the appropriate handlers. It also accepts an optional second parameter for navigation options, such as replacing the current history entry or passing state data.
  </section>
  <section>
  You can also navigate back or forward in the browser history using the back and forward methods. Your browser's back and forward buttons will also work the same way.
  </section>
  <pre><code>
  <span id="cmt">// Navigate forward</span>
  router.<span id="prop">forward</span>();

  <span id="cmt">// Navigate back</span>
  router.<span id="prop">back</span>();
  </code></pre>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="configure">Next: Configure &gt;&gt;</button>
  </section>
  `);
});

router.route('/configure').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Configure',
    description: 'Configuration options and examples for Silkrouter.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/configure',
  });

  render(`
  <section>
    Silkrouter can be configured with different options to suit your needs.
  </section>
  <pre><code>
  <span id="cmt">// Instantiate with options</span>
  <span id="kw">const</span> router = <span id="fc">getRouter</span>({
    basePath: <span id="str">'/'</span>, <span id="cmt">// Base path for all routes</span>
    hashRouter: <span id="kw">false</span>, <span id="cmt">// Use hash-based routing instead of history API</span>
    preservePath: <span id="kw">false</span>, <span id="cmt">// Preserve existing path when using hash-based routing</span>
    memoryRouter: <span id="kw">false</span>, <span id="cmt">// Use in-memory history instead of browser history (useful for nested routing, micro-frontends, etc.)</span>
  });
  </code></pre>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="data">Next: Data &gt;&gt;</button>
  </section>
  `);
});

router.route('/data/:from/:to').subscribe((props) => {
  setMeta({
    title: `Silkrouter — Data ${props.path}`,
    description: `Data view for ${props.path}`,
    pathname: props.pathname,
    url: `https://silkrouter.dev${props.path}`,
  });

  render(`
  <section>
    Silkrouter has three types of data that can be accessed in handlers: <b>params</b>, <b>query</b>, and <b>state</b>.
  </section>
  <section>
    <b>Params</b> are dynamic segments in the path that are defined with a colon (:) in the route pattern. In this example, :from and :to are params that can be accessed in the handler.
  </section>
  <section>
    <b>Query</b> is the search part of the URL that comes after the question mark (?). It can contain multiple key-value pairs that are separated by ampersands (&). In this example, q and r are query parameters that can be accessed in the handler.
  </section>
  <section>
    <b>State</b> is an optional object that can be passed when navigating to a path. It can contain any data that you want to associate with the navigation event. In this example, we are not passing any state, but it can be accessed in the handler if it exists.
  </section>
  <h3>Handler:</h3>
  <pre><code>
  router.<span id="prop">route</span>(<span id="str">'/data/:from/:to'</span>).<span id="prop">subscribe</span>((props) <span id="sym">=></span> {
    console.<span id="prop">log</span>(props);
  });
  </code></pre>
  <h3>Handler Output:</h3>
  <pre><code>${JSON.stringify(props, null, 2)}</code></pre>
  <section>
    The data shown here corresponds to the path <b>"${props.path}"</b> currently rendered in this demo.
  </section>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="cleanup">Next: Cleaning Up &gt;&gt;</button>
  </section>
  `);
});

router.route('/cleanup').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Cleaning Up',
    description: 'Unsubscribe handlers and cleanup patterns for Silkrouter.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/cleanup',
  });

  render(`
  <section>
    Handlers subscribed to paths will remain active and will be called whenever the path changes to a matching path. If you want to unsubscribe a handler, you can call the function returned by the subscribe method.
  </section>
  <pre><code>
  <span id="cmt">// Subscribe to a path</span>
  const unsub = router.<span id="prop">route</span>(<span id="str">'/path'</span>).<span id="prop">subscribe</span>((props) <span id="sym">=></span> {
    console.<span id="prop">log</span>(props);
  });

  <span id="cmt">// Unsubscribe the handler</span>
  unsub();
  </code></pre>
  <section>
    In this example, we subscribe to the path "/path" and then immediately unsubscribe. This means that the handler will not be called when navigating to "/path". It is important to unsubscribe handlers when they are no longer needed to prevent memory leaks and unintended side effects.
  </section>
  <section>
    Additionally, if you no longer need the router instance, you should unsubscribe from it to clean up any handlers and resources used by the router.
  </section>
  <pre><code>
  <span id="cmt">// Unsubscribe from the router instance</span>
  router.<span id="prop">unsubscribe</span>();
  </code></pre>
  <section>
    <button id="back">&lt;&lt; Back</button>
    <button id="events">Next: Events &gt;&gt;</button>
  </section>
  `);
});

router.route('/events').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Events',
    description:
      'Custom event lifecycle (sr:init, sr:transit, sr:done, sr:error) emitted by Silkrouter.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/events',
  });

  render(`
    <section>
      Silkrouter emits custom events on router and path instances. These events are useful for tracking navigation events, debugging, and integrating with other libraries or frameworks. There are four main events:
      <ul>
        <li><b>sr:init</b>: Emitted on the router instance whenever a navigation event occurs. The event detail contains the URL, navigation ID, and any state associated with the navigation.</li>
        <li><b>sr:transit</b>: Emitted on the path instance when route transition starts.</li>
        <li><b>sr:done</b>: Emitted on the path instance when route transition ends.</li>
        <li><b>sr:error</b>: Emitted on the path instance when an error occurs during route transition.</li>
      </ul>
    </section>
    <code><pre>
    <span id="cmt">// Subscribe to 'sr:init' events</span>
    router.<span id="prop">target</span>.<span id="prop">on</span>(<span id="str">'sr:init'</span>, (evt) <span id="sym">=></span> {
      console.<span id="prop">log</span>(<span id="str">'Navigation event:'</span>, evt);
    });

    <span id="cmt">// Subscribe to 'sr:transit' and 'sr:done' events</span>
    <span id="kw">const</span> path = router.<span id="prop">route</span>(<span id="str">'/path'</span>); <span id="cmt">// Use "router.every" to get all paths instance</span>
    path.<span id="prop">target</span>.<span id="prop">on</span>(<span id="str">'sr:transit'</span>, () <span id="sym">=></span> {
      console.<span id="prop">log</span>(<span id="str">'Route transition started'</span>);
    });

    path.<span id="prop">target</span>.<span id="prop">on</span>(<span id="str">'sr:done'</span>, () <span id="sym">=></span> {
      console.<span id="prop">log</span>(<span id="str">'Route transition ended'</span>);
    });

    <span id="cmt">// Subscribe to 'sr:error' event</span>
    path.<span id="prop">target</span>.<span id="prop">on</span>(<span id="str">'sr:error'</span>, () <span id="sym">=></span> {
      console.<span id="prop">error</span>(<span id="str">'Route transition error'</span>);
    });
    </pre></code>
    <section>
      <button id="back">&lt;&lt; Back</button>
      <button id="roadmap">Next: Roadmap &gt;&gt;</button>
    </section>
  `);
});

router.route('/roadmap').subscribe((props) => {
  setMeta({
    title: 'Silkrouter — Roadmap',
    description:
      'Planned features for Silkrouter including SSR support, React router, and interruption hooks.',
    pathname: props.pathname,
    url: 'https://silkrouter.dev/roadmap',
  });

  render(`
  <section>
    As web development evolves, Silkrouter will continue to improve and expand its capabilities to meet the needs of modern web applications. We have completely re-written Silkrouter for v6 to provide a more robust and flexible routing solution, and we have an exciting roadmap ahead.
  </section>
  <section>
    Here are few things Silkrouter will tackle in the near future:
    <ul>
      <li><b>SSR Support:</b> We are actively working on adding support for server-side rendering (SSR) to Silkrouter. This will allow developers to use Silkrouter in SSR frameworks.</li>
      <li><b>Router for React:</b> We are planning to release a router implementation specifically designed for React that will leverage React's features and provide a seamless routing experience for React applications.</li>
      <li><b>Interruption hooks:</b> We are planning to add interruption hooks to Silkrouter to allow developers to handle navigation interruptions gracefully. This is useful to support features like navigation confirmation or prompt the user to save their work before leaving the page.</li>
    </ul>
  </section>
  <section>
    Your feedback and suggestion also plays a crucial role in shaping the future of Silkrouter. If you have any ideas or features you would like to see in Silkrouter, please feel free to reach out to us.
  </section>
  <section>
    Please visit our GitHub page to learn more about Silkrouter, report issues, or contribute to the project: <a href="https://github.com/scssyworks/silkrouter" target="_blank">Silkrouter GitHub</a>
  </section>
  <section>
    <button id="back">&lt;&lt; Back</button>
  </section>
  `);
});
