import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';
import { Box, Typography, Tag } from '@strapi/design-system';
import { Cross } from '@strapi/icons';
import { useDebounce } from '../CommerceProductInput/useDebounce.js';

const CustomTag = ({ label, value, onRemove }) => {
  return (
    <Tag
      icon={<Cross />}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(value);
      }}
      style={{ marginRight: 4, marginBottom: 4 }}
    >
      {label}
    </Tag>
  );
};

const CommerceMultiCategoryInput = React.forwardRef((props, ref) => {
  const { name, value, onChange, intlLabel = {}, attribute, error } = props;
  const { formatMessage } = useIntl();

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Map values to options for react-select
  const mapValuesToOptions = (vals) => {
    if (!Array.isArray(vals)) return [];
    
    return vals.map(val => {
      const found = categoryOptions.find(opt => opt.value === val);
      return found || { label: `Loading... (${val})`, value: val };
    }).filter(opt => opt !== null);
  };

  // Sync external value with local state
  useEffect(() => {
    const initialSelectedValues = Array.isArray(value) ? value : (value ? [value] : []);
    setSelectedCategoryValues(initialSelectedValues);
  }, [value]);

  // Load categories on mount
  useEffect(() => {
    const loadInitialCategories = async () => {
      await fetchCategories('');
    };
    loadInitialCategories();
  }, []);

  // Fetch categories when search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== null) {
      fetchCategories(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery]);

  const fetchCategories = async (searchTerm = '') => {
    setLoading(true);
    setLoadError(null);

    try {
      const endpoint = searchTerm 
        ? `/load-commerce-categories/search-categories?query=${encodeURIComponent(searchTerm)}`
        : '/load-commerce-categories/commerce-categories';

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategoryOptions(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoadError(error.message || 'Failed to load categories');
      setCategoryOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle react-select change
  const handleReactSelectChange = (selectedOptions) => {
    const newValues = selectedOptions
      ? Array.isArray(selectedOptions)
        ? selectedOptions.map(opt => opt.value)
        : [selectedOptions.value]
      : [];
    
    setSelectedCategoryValues(newValues);
    
    // Create the event-like object that Strapi expects
    const changeEvent = {
      target: {
        name,
        value: newValues,
        type: 'select-multiple'
      }
    };
    
    onChange(changeEvent);
  };

  // Handle react-select input change (for search)
  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === 'input-change') {
      setSearchQuery(inputValue);
    }
  };

  const handleRemoveTag = (valToRemove) => {
    const updatedValues = selectedCategoryValues.filter((v) => v !== valToRemove);
    const updatedOptions = mapValuesToOptions(updatedValues);
    handleReactSelectChange(updatedOptions);
  };

  // Get the full selected option objects
  const selectedOptionsForValue = useMemo(() => {
    return mapValuesToOptions(selectedCategoryValues);
  }, [selectedCategoryValues, categoryOptions]);

  // Custom styling for react-select
  const strapiStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? '1px solid #4945ff' : '1px solid #dcdce4',
      borderRadius: '4px',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(73, 69, 255, 0.1)' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#4945ff' : '#b3b5b9'
      },
      minHeight: '2.5rem',
      fontSize: '0.875rem'
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: '#f0f0ff',
      borderRadius: '4px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#32324d',
      fontSize: '0.75rem'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#666687',
      '&:hover': {
        backgroundColor: '#e0e0e0',
        color: '#32324d'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#f0f0ff' : (state.isFocused ? '#f0f0ff' : base.backgroundColor),
      color: state.isSelected ? '#4945ff' : base.color,
      '&:hover': {
        backgroundColor: '#f0f0ff',
        color: '#4945ff'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#8e8ea9',
      fontSize: '0.875rem'
    }),
    input: (base) => ({
      ...base,
      fontSize: '0.875rem'
    }),
    menu: (base) => ({
      ...base,
      fontSize: '0.875rem',
      zIndex: 9999
    })
  };

  // Find a suitable portal target for the dropdown
  const portalTarget = typeof document !== 'undefined' ? document.body : null;

  return (
    <Box>
      <Typography variant="pi" fontWeight="bold" textColor="neutral800" style={{ display: 'block', marginBottom: '4px' }}>
        {formatMessage({
          id: 'commerce-categories.label',
          defaultMessage: intlLabel.defaultMessage || 'Commerce Categories',
        })}
      </Typography>

      <Select
        isMulti
        name={name}
        options={categoryOptions}
        isLoading={loading}
        value={selectedOptionsForValue}
        onChange={handleReactSelectChange}
        onInputChange={handleInputChange}
        placeholder={formatMessage({ id: 'commerce-categories.placeholder', defaultMessage: 'Select or type to search...' })}
        isClearable
        styles={strapiStyles}
        closeMenuOnSelect={false}
        menuPortalTarget={portalTarget}
        menuPosition={'fixed'}
        menuShouldBlockScroll={true}
        noOptionsMessage={() => loadError 
          ? formatMessage({ id: 'commerce-categories.error', defaultMessage: 'Error loading options' }) 
          : (loading 
            ? 'Loading...' 
            : (searchQuery 
              ? 'No categories match your search' 
              : 'Type to search for categories'))}
      />

      {error && (
        <Typography variant="pi" textColor="danger600" style={{ marginTop: '4px' }}>
          {error}
        </Typography>
      )}

      {loadError && !error && (
        <Typography variant="pi" textColor="danger600" style={{ marginTop: '4px' }}>
          {`Loading Error: ${loadError}`}
        </Typography>
      )}
    </Box>
  );
});

export default CommerceMultiCategoryInput;
