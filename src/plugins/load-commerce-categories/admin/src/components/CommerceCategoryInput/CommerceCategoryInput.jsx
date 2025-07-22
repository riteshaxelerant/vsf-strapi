import React, { useState, useEffect } from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { useIntl } from "react-intl";
import axios from 'axios';

// Add styling definitions for different category levels
const levelStyles = {
  1: { fontWeight: 'bold' },
  2: { fontWeight: 'bold' },
  3: { fontWeight: 'normal' },
  4: { fontWeight: 'normal', color: '#666' },
  5: { fontWeight: 'normal', color: '#777', fontSize: '1em' }
};

const CommerceCategoryInput = React.forwardRef((props, ref) => {
  const { name, value, onChange, intlLabel = {}, attribute, error } = props;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { formatMessage } = useIntl();

  // Debug the incoming props
  useEffect(() => {
    console.log('CommerceCategoryInput props:', {
      name,
      value,
      attribute
    });
  }, [name, value, attribute]);

    const fetchCategories = async () => {
        setLoading(true);
        setLoadError(null);
        try {
                // Replace with your actual Magento GraphQL API URL
                const magentoGraphqlUrl = "/load-commerce-categories/commerce-categories";    
                // GraphQL query to fetch first-level categories         
                //const agent = new https.Agent({ rejectUnauthorized: false });
                const response = await axios.get(magentoGraphqlUrl, {
                    headers: {          
                    "Content-Type": "application/json"
                    },            
                });                
                console.log('Raw category data:', response.data);      
                // Use the hierarchical categories directly
                setCategories(response.data);                                 
        
            } catch (error) {
                console.log("Error fetching Magento categories via GraphQL:", error);
                setLoadError(error.message || "Failed to load categories");          
            } finally {
                setLoading(false);
            }
    };

    useEffect(() => {    
        const loadData = async () => {        
            await fetchCategories();
        };
        loadData();
    }, []);

     // Enhanced value change handler with debugging
    const handleChange = (selectedValue) => {
            console.log('Category selection change:', {
            selectedValue,
            type: typeof selectedValue
        });
        
        // Ensure the value is properly formatted as expected by Strapi
        // This is crucial when saving string IDs/UIDs instead of numeric IDs
        const processedValue = selectedValue !== null ? String(selectedValue) : null;
        
        // console.log('Processed value being passed to onChange:', {
        //     processedValue,
        //     type: typeof processedValue
        // });
        
        // Create the event-like object that Strapi expects
        const changeEvent = {
        target: {
            name,
            value: processedValue,
            type: 'select'
        }
        };
        
        // Log the full event object being passed
        //console.log('Change event object:', changeEvent);
        
        // Call the provided onChange handler
        onChange(changeEvent);
    };    
      // Render loading state
    if (loading) {
        return <div>{formatMessage({
          id: 'commerce-category.loading',
          defaultMessage: `${intlLabel.defaultMessage || 'Commerce Category'} (Loading categories...)`
        })}</div>;
    }
    // Render error state
    if (loadError) {
        return (
        <div>
            <div>{formatMessage({
              id: 'commerce-category.label',
              defaultMessage: intlLabel.defaultMessage || 'Commerce Category'
            })}</div>
            <div style={{ color: 'red' }}>Error: {loadError}</div>
            <button onClick={fetchCategories}>{formatMessage({
              id: 'commerce-category.retry',
              defaultMessage: 'Retry'
            })}</button>
        </div>
        );
    }

    return (
        <label>
          {formatMessage({
            id: 'commerce-category.label',
            defaultMessage: intlLabel.defaultMessage || 'Commerce Category'
          })}
          <SingleSelect
            name={name}
            onChange={handleChange}
            value={value}
            error={error}
          >
            {categories.length === 0 ? (
              <SingleSelectOption value="">{formatMessage({
                id: 'commerce-category.no-categories',
                defaultMessage: 'No categories available'
              })}</SingleSelectOption>
            ) : (
              categories.map((category) => {
                // Get the appropriate style based on the level (default to level 1 style if not provided)
                const style = levelStyles[category.level] || levelStyles[1];
                
                return (
                  <SingleSelectOption 
                    key={category.value} 
                    value={category.value}
                    style={style}
                  >
                    {category.label}
                  </SingleSelectOption>
                );
              })
            )}
          </SingleSelect>
          
          {/* Debug display - remove in production */}
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            Selected: {value ? `"${value}" (${typeof value})` : 'none'}
          </div>
        </label>
    );
});
export default CommerceCategoryInput;