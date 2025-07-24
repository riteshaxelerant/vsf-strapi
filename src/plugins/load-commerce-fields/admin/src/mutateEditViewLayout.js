const mutateEditViewLayout = ({ layout, query }) => {
  // Add safety checks to handle potential undefined values in Strapi 5
  if (!layout || !layout.contentType || !layout.contentType.layouts) {
    console.warn('Layout structure is not as expected. Returning unchanged layout.');
    return { layout, query };
  }

  const { edit } = layout.contentType.layouts;
  
  // Check if edit layout exists
  if (!edit) {
    console.warn('Edit layout is undefined. Returning unchanged layout.');
    return { layout, query };
  }

  const enhancedEdit = edit.map(
    (row) =>
      row.map((field) => {
        const { customField } = field.fieldSchema.pluginOptions || {};
        
        // Handle commerce_category_input
        if (customField?.contentType === 'commerce-category-input') {
          return {
            ...field,
            fieldSchema: {
              ...field.fieldSchema,
              type: 'commerce-category-input'
            },
          }
        }
        // Handle commerce_categories_input
        if (customField?.contentType === 'commerce-categories-input') {
          return {
            ...field,
            fieldSchema: {
              ...field.fieldSchema,
              type: 'commerce-categories-input'
            },
          }
        }
        
        // Handle commerce_product_input
        if (customField?.contentType === 'commerce-product-input') {
          return {
            ...field,
            fieldSchema: {
              ...field.fieldSchema,
              type: 'commerce-product-input'
            },
          }
        }
        
        // Handle commerce_category_product_input
        if (customField?.contentType === 'commerce-category-product-input') {
          return {
            ...field,
            fieldSchema: {
              ...field.fieldSchema,
              type: 'commerce-category-product-input'
            },
          }
        }
        
        console.log("Field====>",field);
        return field;
      })
  );

  return {
    query,
    layout: {
      ...layout,
      contentType: {
        ...layout.contentType,
        layouts: {
          ...layout.contentType.layouts,
          edit: enhancedEdit,
        },
      },
    },
  };
};

export default mutateEditViewLayout;
  