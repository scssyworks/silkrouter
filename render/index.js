import { Router } from '../src/js';
import { route, deparam, noMatch, cache } from '../src/js/operators';
import pkg from '../package.json';

function q(selector) {
    if (typeof selector === 'string') {
        const elArray = [];
        selector.split(',')
            .map(selectorPart => selectorPart.trim())
            .forEach(selectorPart => {
                const selected = [...document.querySelectorAll(selectorPart)];
                selected.forEach(el => {
                    if (!elArray.includes(el)) {
                        elArray.push(el);
                    }
                });
            });
        return elArray;
    }
    return [...document.querySelectorAll(...arguments)];
}

function keywordHighlight(text) {
    [
        '(new|throw|let|const|var|typeof|instanceof|in|of|import|case|extends|delete)(\\s)',
        '(function|class|try|catch|finally|do|else)(\\s|{)',
        '(for|while|if)(\\s|\\()',
        '(return|break|continue)(\\s|;)'
    ].forEach(matcher => {
        const regex = new RegExp(matcher, 'g');
        if (regex.test(text)) {
            text = text.replace(regex, (...args) => {
                const [, keyword, extra] = args;
                return `<span class="keyword">${keyword}</span>${extra}`;
            });
        }
    });
    return text;
}

function methodHighlight(text) {
    text = text.replace(/(\.)([^;:'",.())?|\\/^*@%#!~+-[\]{}=]+)(\()/g, (...args) => {
        const [, dot, method, brace] = args;
        return `${dot}<span class="method">${method}</span>${brace}`;
    });
    return text;
}

function suppressComments(text) {
    text = text.replace(/\/\/[^\n]+/g, (comment) => `<span class="comment">${comment}</span>`);
    return text;
}

function highlightFatArrow(text) {
    text = text.replace(/\s=&gt;\s/g, (fatArrow) => `<span class="fat-arrow">${fatArrow}</span>`);
    return text;
}

function highlightString(text) {
    text = text.replace(/['"`].*['"`]/g, (str) => `<span class="str">${str.replace(/\//g, '&#47;')}</span>`);
    return text;
}

function jsHighlight(text) {
    text = highlightString(text);
    text = keywordHighlight(text);
    text = methodHighlight(text);
    text = suppressComments(text);
    text = highlightFatArrow(text);
    return text;
}

function renderDecorators() {
    q('code pre').forEach(decorator => {
        let html = decorator.innerHTML;
        const pattern = html.match(/^\s+/);
        const originalIndent = pattern && pattern[0].length;
        html = html.split('\n').map(codePart => {
            return codePart.substring(originalIndent);
        }).join('\n');
        decorator.innerHTML = jsHighlight(html.trim());
    });
}

function renderVersion() {
    q('.version').forEach(el => (el.querySelector('span').textContent = pkg.version));
}

function initializeRouting() {
    q('#checkHash').forEach(el => {
        el.checked = window.sessionStorage.getItem('checkedStatus') === '1';
    });
    const router = new Router();
    let childRouter = router;
    router.subscribe((e) => {
        q('[data-route]').forEach(el => {
            el.classList.remove('active');
            const elRoute = el.getAttribute('data-route');
            if (elRoute === '/' && e.route === elRoute) {
                el.classList.add('active');
            } else if (elRoute !== '/' && e.route.includes(elRoute)) {
                el.classList.add('active');
            }
        });
        q('[data-section]').forEach(el => {
            el.classList.add('d-none');
            const elSection = el.getAttribute('data-section');
            if (elSection === '/' && e.route === elSection) {
                el.classList.remove('d-none');
            } else if (elSection !== '/' && e.route.includes(elSection)) {
                el.classList.remove('d-none');
            }
        });
        q('.params-data, .query-next-step, .query-data, .pass-data-tutorial').forEach(el => {
            el.classList.add('d-none');
        });
    });
    router.pipe(
        route('/tab3/:firstname/:lastname')
    ).subscribe((e) => {
        q('.params-data pre').forEach(el => {
            el.textContent = JSON.stringify(e.params, null, 2);
        });
        q('.params-data, .query-next-step').forEach(el => {
            el.classList.remove('d-none');
        });
        if (e.search) {
            q('.query-data').forEach(el => {
                el.querySelector('pre').textContent = e.search;
                el.classList.remove('d-none');
            });
            q('.pass-data-tutorial').forEach(el => {
                el.classList.remove('d-none');
            });
        }
    });
    document.addEventListener('click', (e) => {
        q('[data-route]').forEach(el => {
            if (el.contains(e.target)) {
                const isRelative = el.hasAttribute('data-relative');
                const route = isRelative && q('#checkHash:checked').length === 0
                    ? el.closest('section').getAttribute('data-section') + el.getAttribute('data-route')
                    : el.getAttribute('data-route');
                if (isRelative) {
                    childRouter.set(route);
                } else {
                    router.set(route);
                }
            }
        });
        q('.btn-primary.clear-session').forEach(el => {
            if (el.contains(e.target)) {
                window.sessionStorage.clear();
                window.location.href = '/tab2';
            }
        });
        q('.append-param').forEach(el => {
            if (el.contains(e.target)) {
                router.set('/tab3/john/doe');
            }
        });
        q('.append-query').forEach(el => {
            if (el.contains(e.target)) {
                router.set({
                    route: `/tab3/john/doe`,
                    queryString: 'q=HelloWorld'
                });
            }
        });
    });
    q('#checkHash').forEach(el => {
        el.addEventListener('change', () => {
            window.sessionStorage.setItem('checkedStatus', `${q('#checkHash:checked').length}`);
            window.location.href = '/tab2';
        });
    });
    if (q('#checkHash:checked').length) {
        const hashRouter = new Router({
            hashRouting: true,
            preservePath: true
        });
        hashRouter.subscribe((e) => {
            q('[data-route][data-relative]').forEach(el => {
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
renderDecorators();
renderVersion();
setGlobals();