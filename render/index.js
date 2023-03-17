import { Router } from '../src/js';
import { route, deparam, noMatch, cache } from '../src/js/operators';
import pkg from '../package.json';

function q(selector) {
  if (typeof selector === 'string') {
    const elArray = [];
    selector
      .split(',')
      .map((selectorPart) => selectorPart.trim())
      .forEach((selectorPart) => {
        const selected = [...document.querySelectorAll(selectorPart)];
        selected.forEach((el) => {
          if (!elArray.includes(el)) {
            elArray.push(el);
          }
        });
      });
    return elArray;
  }
  // rome-ignore lint/style/noArguments: Keeping default behaviour of querySelectorAll
  return [...document.querySelectorAll(...arguments)];
}

function renderVersion() {
  q('.version').forEach((el) => {
    const wrapper = el.querySelector('span');
    if (wrapper) {
      wrapper.textContent = pkg.version;
    }
  });
}

function initializeRouting() {
  q('#checkHash').forEach((el) => {
    el.checked = window.sessionStorage.getItem('checkedStatus') === '1';
  });
  const router = new Router();
  let childRouter = router;
  router.subscribe((e) => {
    const eventRoute =
      location.hostname === 'scssyworks.github.io'
        ? e.route.replace(/\/silkrouter\//, '/')
        : e.route;
    q('[data-route]').forEach((el) => {
      el.classList.remove('active');
      const elRoute = el.getAttribute('data-route');
      if (elRoute === '/' && eventRoute === elRoute) {
        el.classList.add('active');
      } else if (elRoute !== '/' && eventRoute.includes(elRoute)) {
        el.classList.add('active');
      }
    });
    q('[data-section]').forEach((el) => {
      el.classList.add('d-none');
      const elSection = el.getAttribute('data-section');
      if (elSection === '/' && eventRoute === elSection) {
        el.classList.remove('d-none');
      } else if (elSection !== '/' && eventRoute.includes(elSection)) {
        el.classList.remove('d-none');
      }
    });
    q(
      '.params-data, .query-next-step, .query-data, .data-next-step, .state-data, .pass-data-tutorial'
    ).forEach((el) => {
      el.classList.add('d-none');
    });
  });
  const paramsRoute =
    location.hostname === 'scssyworks.github.io'
      ? '/silkrouter/tab3/:firstname/:lastname'
      : '/tab3/:firstname/:lastname';
  router.pipe(route(paramsRoute), deparam(true)).subscribe((e) => {
    q('.params-data').forEach((el) => {
      el.textContent = JSON.stringify(e.params, null, 2);
    });
    q('.params-data, .query-next-step').forEach((el) => {
      el.classList.remove('d-none');
    });
    if (Object.keys(e.search).length) {
      q('.query-data').forEach((el) => {
        el.textContent = JSON.stringify(e.search, null, 2);
        el.classList.remove('d-none');
      });
      q('.data-next-step').forEach((el) => {
        el.classList.remove('d-none');
      });
    }
    if (e.data) {
      q('.state-data').forEach((el) => {
        el.textContent = e.data;
        el.classList.remove('d-none');
      });
      q('.pass-data-tutorial').forEach((el) => {
        el.classList.remove('d-none');
      });
    }
  });
  document.addEventListener('click', (e) => {
    q('[data-route]').forEach((el) => {
      if (el.contains(e.target)) {
        const isRelative = el.hasAttribute('data-relative');
        let route =
          isRelative && q('#checkHash:checked').length === 0
            ? el.closest('section').getAttribute('data-section') +
              el.getAttribute('data-route')
            : el.getAttribute('data-route');
        if (location.hostname === 'scssyworks.github.io') {
          route = `/silkrouter${route}`;
        }
        if (isRelative) {
          if (
            location.hostname === 'scssyworks.github.io' &&
            childRouter.config.hashRouting
          ) {
            route = route.replace(/\/silkrouter\//, '/');
          }
          childRouter.navigate(route);
        } else {
          router.navigate(route);
        }
      }
    });
    q('.btn-primary.clear-session').forEach((el) => {
      if (el.contains(e.target)) {
        window.sessionStorage.clear();
        window.location.href =
          location.hostname === 'scssyworks.github.io'
            ? '/silkrouter/tab2/'
            : '/tab2/';
      }
    });
    q('.append-param').forEach((el) => {
      if (el.contains(e.target)) {
        router.navigate(
          `${
            location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''
          }/tab3/john/doe`
        );
      }
    });
    q('.append-query').forEach((el) => {
      if (el.contains(e.target)) {
        router.navigate({
          route: `${
            location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''
          }/tab3/john/doe`,
          queryString: 'q=HelloWorld',
        });
      }
    });
    q('.append-data').forEach((el) => {
      if (el.contains(e.target)) {
        router.set({
          route: `${
            location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''
          }/tab3/john/doe`,
          queryString: 'q=HelloWorld',
          data: 'Hi there!',
        });
      }
    });
  });
  q('#checkHash').forEach((el) => {
    el.addEventListener('change', () => {
      window.sessionStorage.setItem(
        'checkedStatus',
        `${q('#checkHash:checked').length}`
      );
      window.location.href = `${
        location.hostname === 'scssyworks.github.io' ? '/silkrouter' : ''
      }/tab2/`;
    });
  });
  if (q('#checkHash:checked').length) {
    const hashRouter = new Router({
      hashRouting: true,
      preservePath: true,
    });
    hashRouter.subscribe((e) => {
      q('[data-route][data-relative]').forEach((el) => {
        el.classList.remove('active');
        if (e.route.includes(el.getAttribute('data-route'))) {
          el.classList.add('active');
        }
      });
    });
    childRouter = hashRouter;
  }
}

function setGlobals() {
  window.Router = Router;
  window.route = route;
  window.deparam = deparam;
  window.noMatch = noMatch;
  window.cache = cache;
}

initializeRouting();
renderVersion();
setGlobals();
