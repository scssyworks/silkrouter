import { getRouter } from '../../src/router';

const appRoot = document.querySelector('app-root');
const router = getRouter();
(window as any).router = router;

if (appRoot) {
  router.subscribe(event => {
    console.log(event);
    appRoot.innerHTML = event.url.pathname;
  });
}
