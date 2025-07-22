'use strict';

module.exports = ({ strapi }) => ({  
  async getCategories(ctx) {    
    try {
      
      const commerceCategoriesService = strapi.plugin('load-commerce-categories').service('commerceCategoriesService');
      const categories = await commerceCategoriesService.getCommerceCategories();      
      return categories;
    } catch (error) {
      console.log('Error getting commerce categories:', error);
      ctx.throw(500, error.message || 'Failed to fetch categories');
    }  
  },
  
  // New method to search categories by name
  async searchCategories(ctx) {
    try {
      const { query } = ctx.request.query;
      
      const commerceCategoriesService = strapi
        .plugin('load-commerce-categories')
        .service('commerceCategoriesService');
      
      const categories = await commerceCategoriesService.searchCategories(query);
      return categories;
    } catch (error) {
      console.log('Error searching categories:', error);
      ctx.throw(500, error.message || 'Failed to search categories');
    }
  },
  
  // New method to handle product fetching
  async getProducts(ctx) {
    try {
      const { categoryUid } = ctx.request.query;
      
      if (!categoryUid) {
        return ctx.badRequest('Category UID is required');
      }
      
      const commerceCategoriesService = strapi.plugin('load-commerce-categories').service('commerceCategoriesService');
      const products = await commerceCategoriesService.getProductsByCategory(categoryUid);
      return products;
    } catch (error) {
      console.log('Error getting products:', error);
      ctx.throw(500, error.message || 'Failed to fetch products');
    }
  },
  
  // New method to handle product searching
  async searchProducts(ctx) {
    try {
      const { query } = ctx.request.query;
      
      if (!query) {
        // If no query provided, return a limited set of initial products
        const defaultProducts = await strapi
          .plugin('load-commerce-categories')
          .service('commerceCategoriesService')
          .searchProducts('');
        
        return defaultProducts.slice(0, 10); // Return only first 10 products
      }
      
      const commerceCategoriesService = strapi
        .plugin('load-commerce-categories')
        .service('commerceCategoriesService');
        
      const products = await commerceCategoriesService.searchProducts(query);
      return products;
    } catch (error) {
      console.log('Error searching products:', error);
      ctx.throw(500, error.message || 'Failed to search products');
    }
  }
});
