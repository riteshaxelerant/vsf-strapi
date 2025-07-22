'use strict';

import pluginId from './admin/src/pluginId';

export default {
  async register(app) {
    const pluginInfo = {
      id: pluginId,
      name: 'Load Commerce Categories',
    };

    const plugin = await import('./admin/src/index.js');
    await plugin.default.register(app);

    app.registerPlugin(pluginInfo);
  },

  async bootstrap(app) {
    const plugin = await import('./admin/src/index.js');
    await plugin.default.bootstrap(app);
  },

  async registerTrads({ locales }) {
    const plugin = await import('./admin/src/index.js');
    const result = await plugin.default.registerTrads({ locales });
    return result;
  },
};
