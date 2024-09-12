import { getRouter } from '../../src/router';

const appRoot = document.querySelector('app-root');
const router = getRouter();
(window as any).router = router;

if (appRoot) {
  router.subscribe((url, state, event) => {
    console.log(url, state, event);
    appRoot.innerHTML = url.pathname;
  });
}
