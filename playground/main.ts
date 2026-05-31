import { createEmitter, getRouter } from '../src/web/main';
import './main.css';
import { render } from './utils/render';

const $body = createEmitter(document.body);

const router = getRouter();

$body.on('click', (event) => {
  const evt = event.originalEvent as MouseEvent;
  const installBtn = (evt.target as HTMLElement).closest('button#install');
  if (installBtn) {
    router.navigate('/install');
  }
});

router.route('/').subscribe(() => {
  render(`
  <section>
    Silkrouter has been developed with one idea in mind: <b>simplicity</b>. It has an easy-to-use API that can be used with any CSR library or framework. SSR support will be added soon.
  </section>
  <section>
    This demo is designed as step by step interactive demo that will guide you through the core concepts of Silkrouter.
  </section>
  <section>
    To start please click on the <b>Next</b> button below.
  </section>
  <section>
    <button id="install">Next: Installation >></button>
  </section>
  `);
});

router.route('/install').subscribe(() => {
  render(`
  <section>
    Silkrouter is available to install via NPM
  </section>
  <pre>npm i --save-exact silkrouter</pre>
  <section>
    <button id="initialize">Next: Initialize &gt;&gt;</button>
  </section>
  `);
});
