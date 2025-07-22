import pluginId from './pluginId';
//import PluginIcon from './components/PluginIcon';
import mutateEditViewLayout from './mutateEditViewLayout';

const name = 'load-commerce-categories';

export default {
  register(app) {   
    app.customFields.register({
      name: "commerce_category_input",
      pluginId: pluginId, 
      type: "string",
      intlLabel: {
        id: "commerce-category-input.load-commerce-categories.label",
        defaultMessage: "Commerce Category",
      },
      intlDescription: {
        id: "commerce-category-input.load-commerce-categories.description",
        defaultMessage: "Select Category",
      },
      components: {
        Input: async () => import("./components/CommerceCategoryInput"),
      },
      options: {
        // declare options here
      },
    }); 

    // Regiser multiselect field for categories
    app.customFields.register({
      name: "commerce_categories_input",
      pluginId: pluginId, 
      type: "json",
      intlLabel: {
        id: "commerce-categories-input.load-commerce-categories.label",
        defaultMessage: "Commerce Categories",
      },
      intlDescription: {
        id: "commerce-categories-input.load-commerce-categories.description",
        defaultMessage: "Select Categories",
      },
      components: {
        Input: async () => import("./components/CommerceMultiCategoryInput"),
      },
      options: {
        // declare options here
      },
    }); 
    
    // Register the product input field
    app.customFields.register({
      name: "commerce_product_input",
      pluginId: pluginId, 
      type: "json",
      intlLabel: {
        id: "commerce-product-input.load-commerce-categories.label",
        defaultMessage: "Commerce Products",
      },
      intlDescription: {
        id: "commerce-product-input.load-commerce-categories.description",
        defaultMessage: "Select Products",
      },
      components: {
        Input: async () => import("./components/CommerceProductInput"),
      },
      options: {
        // declare options here
      },
    });
    
    // Register the combined category-product input field
    app.customFields.register({
      name: "commerce_category_product_input",
      pluginId: pluginId, 
      type: "json",
      intlLabel: {
        id: "commerce-category-product-input.load-commerce-categories.label",
        defaultMessage: "Commerce Category & Product",
      },
      intlDescription: {
        id: "commerce-category-product-input.load-commerce-categories.description",
        defaultMessage: "Select Category and Product",
      },
      components: {
        Input: async () => import("./components/CommerceCategoryProductInput"),
      },
      options: {
        // declare options here
      },
    });
    
    app.registerPlugin({
      id: pluginId,
      initializer: Initializer => import('./components/Initializer').then(component => component.default),
      isReady: false,
      name,
    });
  },

  bootstrap(app) {
    // https://github.com/strapi/strapi/blob/0f9b69298b2d94b31b434bd7217060570ae89374/packages/core/admin/admin/src/exposedHooks.js
    // MUTATE_EDIT_VIEW_LAYOUT
    app.registerHook(
      'Admin/CM/pages/EditView/mutate-edit-view-layout',
      mutateEditViewLayout,
    );
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            // Simple prefix function to replace prefixPluginTranslations
            const prefixedData = {};
            Object.keys(data).forEach(key => {
              prefixedData[`${pluginId}.${key}`] = data[key];
            });
            return {
              data: prefixedData,
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
