"use strict";

module.exports = {
  default: {
    graphqlEndpoint: "https://magento.test/graphql",
    cacheTimeout: 3600, // 1 hour cache
  },
  validator(config) {
    if (!config.graphqlEndpoint) {
      throw new Error("graphqlEndpoint is required");
    }
  },
};
