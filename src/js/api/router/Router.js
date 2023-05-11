import { assign } from '../../utils/assign';
import set from '../set';
import { getGlobal } from '../../utils/getGlobal';
import { RouterCore } from './RouterCore';

export class Router extends RouterCore {
  constructor(config = {}) {
    const global = getGlobal();
    const { history, location, document } = global;
    const context = document.body;
    const browserConfig = assign(
      {
        init: true, // Initialize as soon as route handler is attached
        hashRouting: false, // Switch to hash routing
        preservePath: false, // Works for hash routing
      },
      config
    );
    super({
      global,
      history,
      location,
      context,
      hash: browserConfig.hashRouting,
    });
    this.config = Object.freeze(
      assign(browserConfig, { context, history, location })
    );
    if (browserConfig.hashRouting && !location.hash) {
      this.set('/', true, false);
    }
  }
  set(...props) {
    return set.apply(this, props);
  }
}
