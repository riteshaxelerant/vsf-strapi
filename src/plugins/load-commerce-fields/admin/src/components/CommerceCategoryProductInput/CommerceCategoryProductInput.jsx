import React, { useState, useEffect } from 'react';
import { Box } from '@strapi/design-system';
import { Typography } from '@strapi/design-system';
import { useIntl } from "react-intl";
import CommerceCategoryInput from '../CommerceCategoryInput/CommerceCategoryInput';
import CommerceProductInput from '../CommerceProductInput/CommerceProductInput';

const CommerceCategoryProductInput = React.forwardRef((props, ref) => {
  const { name, value, onChange, intlLabel = {}, attribute, error } = props;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const { formatMessage } = useIntl();

  // Debug the incoming props
  useEffect(() => {
    console.log('CommerceCategoryProductInput props:', {
      name,
      value,
      attribute
    });
  }, [name, value, attribute]);

  // Parse the value if it's a JSON string
  useEffect(() => {
    if (value) {
      try {
        if (typeof value === 'string') {
          const parsedValue = JSON.parse(value);
          setSelectedCategory(parsedValue.category || null);
          
          // Handle both new array format and legacy single product format
          if (parsedValue.products && Array.isArray(parsedValue.products)) {
            setSelectedProducts(parsedValue.products);
          } else if (parsedValue.product) {
            setSelectedProducts([parsedValue.product]); // Convert single to array
          } else {
            setSelectedProducts([]);
          }
        } else if (typeof value === 'object') {
          setSelectedCategory(value.category || null);
          
          // Handle both formats in object
          if (value.products && Array.isArray(value.products)) {
            setSelectedProducts(value.products);
          } else if (value.product) {
            setSelectedProducts([value.product]); // Convert single to array
          } else {
            setSelectedProducts([]);
          }
        }
      } catch (e) {
        console.error('Error parsing value:', e);
      }
    } else {
      // Reset state if value is empty
      setSelectedCategory(null);
      setSelectedProducts([]);
    }
  }, [value]);

  // Handle category change
  const handleCategoryChange = (event) => {
    const categoryValue = event.target.value;
    console.log('Category changed to:', categoryValue);
    setSelectedCategory(categoryValue);
    setSelectedProducts([]); // Reset products when category changes
    
    // Update the combined value with new structure using products array
    const newValue = JSON.stringify({
      category: categoryValue,
      products: [] // Empty array for products
    });
    
    console.log('New combined value:', newValue);
    
    onChange({
      target: {
        name,
        value: newValue,
        type: 'json'
      }
    });
  };

  // Handle multiple products selection
  const handleProductsChange = (event) => {
    const productsValue = event.target.value;
    console.log('Products changed to:', productsValue);
    setSelectedProducts(productsValue);
    
    // Update the combined value with new multi-product structure
    const newValue = JSON.stringify({
      category: selectedCategory,
      products: productsValue
    });
    
    console.log('New combined value:', newValue);
    
    onChange({
      target: {
        name,
        value: newValue,
        type: 'json'
      }
    });
  };

  return (
    <div>
      <Typography variant="pi" fontWeight="bold">
        {formatMessage({
          id: 'commerce-category-product.label',
          defaultMessage: intlLabel.defaultMessage || 'Commerce Category & Products'
        })}
      </Typography>
      
      <Box padding={2} background="neutral100" borderRadius="4px">
        <div>
          {/* Category Selection */}
          <CommerceCategoryInput
            name={`${name}_category`}
            value={selectedCategory}
            onChange={handleCategoryChange}
            intlLabel={{ id: 'commerce-category-product.category.label', defaultMessage: 'Category' }}
            attribute={attribute}
            error={error}
          />
          
          {/* Product Selection - Only show if category is selected */}
          {selectedCategory && (
            <CommerceProductInput
              name={`${name}_products`}
              value={selectedProducts}
              onChange={handleProductsChange}
              intlLabel={{ id: 'commerce-category-product.products.label', defaultMessage: 'Products' }}
              attribute={attribute}
              error={error}
              categoryUid={selectedCategory}
              multiSelect={true}
            />
          )}
          
          {/* Debug display - remove in production */}
          <Box padding={2} background="neutral200" borderRadius="4px">
            <Typography variant="pi">
              Selected Category: {selectedCategory || 'none'}<br />
              Selected Products: {JSON.stringify(selectedProducts) || 'none'}<br />
              Combined Value: {value || 'none'}
            </Typography>
          </Box>
        </div>
      </Box>
    </div>
  );
});

export default CommerceCategoryProductInput; 