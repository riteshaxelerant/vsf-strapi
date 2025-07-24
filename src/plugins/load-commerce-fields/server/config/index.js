'use strict';

module.exports = {
  default: {
    graphqlEndpoint: 'https://shop.axelerators.ai/graphql',
    cacheTimeout: 3600 // 1 hour cache
  },
  validator(config) {
    if (!config.graphqlEndpoint) {
      throw new Error('graphqlEndpoint is required');
    }
  },
};