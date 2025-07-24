import React, { useState, useEffect, useMemo } from "react";
import Select, { components } from "react-select";
import { useIntl } from "react-intl";
import { Box, Typography, Tag } from "@strapi/design-system";
import { Cross } from "@strapi/icons";
import { useDebounce } from "./useDebounce.js";

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

const Placeholder = (props) => {
  return <components.Placeholder {...props} />;
};

const CommerceProductInput = React.forwardRef((props, ref) => {
  const {
    name,
    value,
    onChange,
    intlLabel = {},
    attribute,
    error,
    categoryUid = null,
    multiSelect = true,
  } = props;

  const { formatMessage } = useIntl();
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProductValues, setSelectedProductValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Map values to options for react-select
  const mapValuesToOptions = (vals) => {
    if (!Array.isArray(vals)) return [];

    return vals
      .map((val) => {
        const found = productOptions.find((opt) => opt.value === val);
        return found || { label: `Loading... (${val})`, value: val };
      })
      .filter((opt) => opt !== null);
  };

  // Sync external value with local state
  useEffect(() => {
    const initialSelectedValues = Array.isArray(value)
      ? value
      : value
        ? [value]
        : [];
    setSelectedProductValues(initialSelectedValues);

    const initialSelectedOptions = mapValuesToOptions(initialSelectedValues);
    console.log("Initial product value sync:", {
      value,
      initialSelectedValues,
      initialSelectedOptions,
    });
  }, [value, productOptions]);

  // Load products on mount or when categoryUid changes
  useEffect(() => {
    const loadInitialProducts = async () => {
      if (categoryUid) {
        await fetchProductsByCategory(categoryUid);
      } else {
        await fetchProducts("");
      }
    };
    loadInitialProducts();
  }, [categoryUid]);

  // Fetch products when search query changes
  useEffect(() => {
    if (debouncedSearchQuery !== null) {
      if (categoryUid) {
        fetchProductsByCategory(categoryUid, debouncedSearchQuery);
      } else {
        fetchProducts(debouncedSearchQuery);
      }
    }
  }, [debouncedSearchQuery, categoryUid]);

  const fetchProducts = async (searchTerm = "") => {
    setLoading(true);
    setLoadError(null);

    try {
      const endpoint = searchTerm
        ? `/load-commerce-fields/search-products?query=${encodeURIComponent(searchTerm)}`
        : "/load-commerce-fields/search-products";

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProductOptions(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoadError(error.message || "Failed to load products");
      setProductOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (catUid, searchTerm = "") => {
    setLoading(true);
    setLoadError(null);

    try {
      let endpoint = `/load-commerce-fields/commerce-products?categoryUid=${encodeURIComponent(catUid)}`;
      if (searchTerm) {
        // For category-specific search, we can combine both parameters
        endpoint = `/load-commerce-fields/search-products?query=${encodeURIComponent(searchTerm)}`;
      }

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProductOptions(data || []);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      setLoadError(error.message || "Failed to load products");
      setProductOptions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReactSelectChange = (selectedOptions) => {
    const newValues = selectedOptions
      ? Array.isArray(selectedOptions)
        ? selectedOptions.map((opt) => opt.value)
        : [selectedOptions.value]
      : [];

    setSelectedProductValues(newValues);

    const finalValue = multiSelect ? newValues : newValues[0] || "";

    // Create the event-like object that Strapi expects
    const changeEvent = {
      target: {
        name,
        value: finalValue,
        type: multiSelect ? "select-multiple" : "select",
      },
    };

    onChange(changeEvent);
  };

  const handleInputChange = (inputValue, actionMeta) => {
    if (actionMeta.action === "input-change") {
      setSearchQuery(inputValue);
    }
  };

  const handleRemoveTag = (valToRemove) => {
    const updatedValues = selectedProductValues.filter(
      (v) => v !== valToRemove
    );
    const updatedOptions = mapValuesToOptions(updatedValues);
    handleReactSelectChange(updatedOptions);
  };

  // Get the full selected option objects
  const selectedOptionsForValue = useMemo(() => {
    if (multiSelect) {
      return mapValuesToOptions(selectedProductValues);
    } else {
      const singleValue = selectedProductValues[0];
      if (singleValue) {
        const found = productOptions.find((opt) => opt.value === singleValue);
        return (
          found || { label: `Loading... (${singleValue})`, value: singleValue }
        );
      }
      return null;
    }
  }, [selectedProductValues, productOptions, multiSelect]);

  // Custom styling for react-select
  const strapiStyles = {
    control: (base, state) => ({
      ...base,
      border: state.isFocused ? "1px solid #4945ff" : "1px solid #dcdce4",
      borderRadius: "4px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(73, 69, 255, 0.1)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#4945ff" : "#b3b5b9",
      },
      minHeight: "2.5rem",
      fontSize: "0.875rem",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#f0f0ff",
      borderRadius: "4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#32324d",
      fontSize: "0.75rem",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#666687",
      "&:hover": {
        backgroundColor: "#e0e0e0",
        color: "#32324d",
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#f0f0ff"
        : state.isFocused
          ? "#f0f0ff"
          : base.backgroundColor,
      color: state.isSelected ? "#4945ff" : base.color,
      "&:hover": {
        backgroundColor: "#f0f0ff",
        color: "#4945ff",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#8e8ea9",
      fontSize: "0.875rem",
    }),
    input: (base) => ({
      ...base,
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      fontSize: "0.875rem",
      zIndex: 9999,
    }),
  };

  // Find a suitable portal target for the dropdown
  const portalTarget = typeof document !== "undefined" ? document.body : null;

  return (
    <Box>
      <Typography
        variant="pi"
        fontWeight="bold"
        textColor="neutral800"
        style={{ display: "block", marginBottom: "4px" }}
      >
        {formatMessage({
          id: "commerce-products.label",
          defaultMessage: intlLabel.defaultMessage || "Commerce Products",
        })}
      </Typography>

      <Select
        isMulti={multiSelect}
        name={name}
        options={productOptions}
        isLoading={loading}
        value={selectedOptionsForValue}
        onChange={handleReactSelectChange}
        onInputChange={handleInputChange}
        placeholder={formatMessage({
          id: "commerce-products.placeholder",
          defaultMessage: categoryUid
            ? "Select or type to search products in category..."
            : "Select or type to search products...",
        })}
        isClearable
        styles={strapiStyles}
        closeMenuOnSelect={!multiSelect}
        menuPortalTarget={portalTarget}
        menuPosition={"fixed"}
        menuShouldBlockScroll={true}
        components={{ Placeholder }}
        noOptionsMessage={() =>
          loadError
            ? formatMessage({
                id: "commerce-products.error",
                defaultMessage: "Error loading options",
              })
            : loading
              ? "Loading..."
              : searchQuery
                ? "No products match your search"
                : "Type to search for products"
        }
      />

      {error && (
        <Typography
          variant="pi"
          textColor="danger600"
          style={{ marginTop: "4px" }}
        >
          {error}
        </Typography>
      )}

      {loadError && !error && (
        <Typography
          variant="pi"
          textColor="danger600"
          style={{ marginTop: "4px" }}
        >
          {`Loading Error: ${loadError}`}
        </Typography>
      )}
    </Box>
  );
});

export default CommerceProductInput;
