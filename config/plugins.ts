export default ({ env }) => ({
  "load-commerce-fields": {
    enabled: true,
    resolve: "./src/plugins/load-commerce-fields",
    config: {
      graphqlEndpoint: env(
        "MAGENTO_GRAPHQL_ENDPOINT",
        "https://magento.test/graphql"
      ),
    },
  },
});
