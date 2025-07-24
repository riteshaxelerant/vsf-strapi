module.exports = [
  {
    method: 'GET',
    path: '/commerce-categories',
    handler: 'commerceCategoriesController.getCategories',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/search-categories',
    handler: 'commerceCategoriesController.searchCategories',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/commerce-products',
    handler: 'commerceCategoriesController.getProducts',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/search-products',
    handler: 'commerceCategoriesController.searchProducts',
    config: {
      policies: [],
      auth: false,
    },
  },
];
