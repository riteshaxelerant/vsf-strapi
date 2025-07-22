export default ({ env }) => ({
  "load-commerce-categories": {
    enabled: true,
    resolve: "./src/plugins/load-commerce-categories",
    config: {
      graphqlEndpoint: env('MAGENTO_GRAPHQL_ENDPOINT', 'https://shop.axelerators.ai/graphql'),
    },
  },
});
