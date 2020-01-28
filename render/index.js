import { Router } from '../src/js';
import { route, deparam, noMatch } from '../src/js/operators';

window.Router = Router;
window.route = route;
window.deparam = deparam;
window.noMatch = noMatch;