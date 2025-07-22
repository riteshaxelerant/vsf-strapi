"use strict";

module.exports = ({ strapi }) => {
  strapi.customFields.register({
    name: "commerce_category_input",
    plugin: "load-commerce-categories",
    type: "string",
  });
  strapi.customFields.register({
    name: "commerce_categories_input",
    plugin: "load-commerce-categories",
    type: "json",
  });
  strapi.customFields.register({
    name: 'commerce_category_product_input',
    plugin: 'load-commerce-categories',
    type: 'string', // Adjust type as needed (e.g., 'json', 'text')
    // Additional options if applicable
  });
  strapi.customFields.register({
    name: 'commerce_product_input',
    plugin: 'load-commerce-categories',
    type: 'json', // Adjust type as needed (e.g., 'json', 'text')
    // Additional options if applicable
  });
};
