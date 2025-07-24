"use strict";

const https = require('https');

module.exports = ({ strapi }) => ({
  async getCommerceCategories() {
    const pluginConfig = strapi.config.get("plugin::load-commerce-fields");
    const endpoint = pluginConfig.graphqlEndpoint;
    console.log('GraphQL Endpoint:', endpoint);
    if (!endpoint) {
      throw new Error("Magento GraphQL endpoint is not configured");
    }

    // Handle SSL issues for Node.js fetch
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    
    try {
      // Set environment variable to ignore SSL certificates if needed
      if (endpoint.startsWith('https')) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      // Updated GraphQL query to fetch categories - we'll filter for active and menu-enabled in JS
      const graphqlQuery = {
        query: `
          {
            categories(
              filters: {
                parent_id: {eq: "2"}
              }
            ) {
              total_count
              items {
                uid
                name
                level
                path
                children_count
                include_in_menu
                children {
                  uid
                  name
                  level
                  path
                  children_count
                  include_in_menu
                  children {
                    uid
                    name
                    level
                    path
                    children_count
                    include_in_menu
                  }
                }
              }
            }
          }
        `,
      };

      console.log('Sending GraphQL query:', JSON.stringify(graphqlQuery, null, 2));

      // Make a GraphQL request to Magento using fetch
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Strapi-Plugin/1.0"
        },
        body: JSON.stringify(graphqlQuery)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response body:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // Parse JSON response
      const responseData = await response.json();
      console.log('Response data:', JSON.stringify(responseData, null, 2));

      // Function to transform the categories into a hierarchical format with indentation
      function formatCategoriesWithIndentation(categories, level = 0) {
        let result = [];

        if (!categories || categories.length === 0) {
          return result;
        }

        categories.forEach((category) => {
          // Skip categories not included in menu
          if (
            category.include_in_menu === false ||
            category.include_in_menu === "0"
          ) {
            return;
          }

          // Add indentation prefix based on level
          const indentPrefix = level > 0 ? "—".repeat(level) + " " : "";

          // Add this category to results
          result.push({
            label: indentPrefix + category.name,
            value: category.uid,
            level: category.level,
          });

          // Process children if they exist
          if (category.children && category.children.length > 0) {
            const childCategories = formatCategoriesWithIndentation(
              category.children,
              level + 1
            );
            result = result.concat(childCategories);
          }
        });

        return result;
      }

      // Extract categories from response
      if (
        responseData &&
        responseData.data &&
        responseData.data.categories &&
        responseData.data.categories.items
      ) {
        return formatCategoriesWithIndentation(
          responseData.data.categories.items
        );
      }
      // Return empty array if no categories found
      return [];
    } catch (error) {
      strapi.log.error("Error fetching Magento categories via GraphQL:", error);
      return [];
    } finally {
      // Restore original SSL setting
      if (originalRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
    }
  },

  // New method to search categories based on a query string
  async searchCategories(searchTerm) {
    // First get all categories
    const allCategories = await this.getCommerceCategories();

    // If no search term, return first 20 categories
    if (!searchTerm) {
      return allCategories.slice(0, 20);
    }

    // Case-insensitive search in category names
    const searchTermLower = searchTerm.toLowerCase();

    // Filter categories that match the search term
    const filteredCategories = allCategories.filter((category) => {
      // Remove indentation for search matching purposes
      const cleanLabel = category.label.replace(/^—+\s*/, "");
      return cleanLabel.toLowerCase().includes(searchTermLower);
    });

    // Return matching categories (limited to 20 results)
    return filteredCategories.slice(0, 20);
  },

  // New method to fetch products by category
  async getProductsByCategory(categoryUid) {
    const pluginConfig = strapi.config.get("plugin::load-commerce-fields");
    const endpoint = pluginConfig.graphqlEndpoint;
    if (!endpoint) {
      throw new Error("Magento GraphQL endpoint is not configured");
    }

    // Handle SSL issues for Node.js fetch
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    
    try {
      // Set environment variable to ignore SSL certificates if needed
      if (endpoint.startsWith('https')) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      // GraphQL query to fetch products based on category UID
      const graphqlQuery = {
        query: `{
          products(filter: { category_uid: { eq: \"${categoryUid}\" } }) {
            items {
              id: sku
              name
            }
          }
        }`,
      };

      // Make a GraphQL request to Magento using fetch
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Strapi-Plugin/1.0"
        },
        body: JSON.stringify(graphqlQuery),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // Parse JSON response
      const responseData = await response.json();

      // Extract products from response
      const products = responseData.data.products.items;
      console.log(products);
      // Format products as { label: "Product Name", value: "Product ID" }
      return products.map((product) => ({
        label: product.name,
        value: String(product.id),
      }));
    } catch (error) {
      strapi.log.error("Error fetching Magento products via GraphQL:", error);
      return [];
    } finally {
      // Restore original SSL setting
      if (originalRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
    }
  },

  // New method to search products by name
  async searchProducts(searchTerm) {
    const pluginConfig = strapi.config.get("plugin::load-commerce-fields");
    const endpoint = pluginConfig.graphqlEndpoint;
    if (!endpoint) {
      throw new Error("Magento GraphQL endpoint is not configured");
    }

    // Handle SSL issues for Node.js fetch
    const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
    
    try {
      // Set environment variable to ignore SSL certificates if needed
      if (endpoint.startsWith('https')) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      }

      // GraphQL query to search products by name
      const graphqlQuery = {
        query: `{
          products(
            search: "${searchTerm}",
            pageSize: 20
          ) {
            items {
              id: sku
              name
            }
          }
        }`,
      };

      // Make a GraphQL request to Magento using fetch
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "User-Agent": "Strapi-Plugin/1.0"
        },
        body: JSON.stringify(graphqlQuery),
      });

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      // Parse JSON response
      const responseData = await response.json();

      // Extract products from response
      const products = responseData.data.products.items;

      // Format products as { label: "Product Name", value: "Product ID" }
      return products.map((product) => ({
        label: product.name,
        value: String(product.id),
        sku: product.sku, // Including SKU for better display
      }));
    } catch (error) {
      strapi.log.error("Error searching Magento products via GraphQL:", error);
      return [];
    } finally {
      // Restore original SSL setting
      if (originalRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
    }
  },
});
