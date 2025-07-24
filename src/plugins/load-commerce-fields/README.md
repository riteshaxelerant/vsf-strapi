# Load Commerce Fields - Strapi Plugin

A Strapi plugin that integrates with Magento GraphQL API to provide searchable category and product selection fields in the admin panel.

## ✨ Features

- **Single Category Selection** - Dropdown with hierarchical category display
- **Multi-Category Selection** - Searchable multi-select with real-time filtering  
- **Product Selection** - Searchable product picker (single or multi-select)
- **Category + Products** - Combined selection component
- **Real-time Search** - Type to filter categories and products
- **Plug & Play** - No separate npm install required in plugin directory
- **Native Fetch API** - Uses modern fetch instead of axios for better compatibility
- **SSL Support** - Handles SSL certificate issues automatically
- **Node.js 20+ Compatible** - Optimized for latest Node.js versions

## 🚀 Installation

### Step 1: Install Required Dependency

Add `react-select` to your main Strapi project:

```bash
npm install react-select@^5.10.1
```

### Step 2: Copy Plugin

Copy the entire `load-commerce-fields` folder to your Strapi project:

```
your-strapi-project/
├── src/
│   ├── plugins/
│   │   └── load-commerce-fields/    ← Copy this folder here
│   └── ...
├── package.json
└── ...
```

### Step 3: Configure Plugin

Add the plugin configuration to your `config/plugins.ts` file:

```typescript
export default {
  // ... other plugins
  'load-commerce-fields': {
    enabled: true,
    resolve: './src/plugins/load-commerce-fields',
    config: {
      graphqlEndpoint: 'https://your-magento-store.com/graphql'
    }
  }
};
```

### Step 4: Environment Variables

Add your Magento GraphQL endpoint to your `.env` file:

```bash
MAGENTO_GRAPHQL_ENDPOINT=https://your-magento-store.com/graphql
```

### Step 5: Restart Strapi

```bash
npm run build
npm run develop
```

## 🎯 Usage

Once installed, you'll have access to these custom field types in your content types:

### 1. Commerce Category Input
- **Field Type**: `commerce_category_input`
- **Data Type**: String
- **Use Case**: Single category selection

### 2. Commerce Categories Input  
- **Field Type**: `commerce_categories_input`
- **Data Type**: JSON
- **Use Case**: Multiple category selection

### 3. Commerce Product Input
- **Field Type**: `commerce_product_input` 
- **Data Type**: JSON
- **Use Case**: Product selection with search

### 4. Commerce Category & Product Input
- **Field Type**: `commerce_category_product_input`
- **Data Type**: JSON  
- **Use Case**: Combined category and product selection

## 📡 API Endpoints

The plugin exposes REST API endpoints for external integrations:

### Base URL
All endpoints are available under: `http://localhost:1337/load-commerce-fields/`

#### 1. Get All Categories
**Endpoint:** `GET /load-commerce-fields/commerce-categories`

**Description:** Retrieves all categories from Magento with hierarchical structure.

**Example:**
```bash
curl -X GET "http://localhost:1337/load-commerce-fields/commerce-categories"
```

**Sample Response:**
```json
[
  {
    "value": "Mw==",
    "label": "Gear",
    "level": 1
  },
  {
    "value": "NA==", 
    "label": "  Bags",
    "level": 2
  }
]
```

#### 2. Search Categories
**Endpoint:** `GET /load-commerce-fields/search-categories?search={term}`

**Description:** Search categories by name with optional search term.

**Parameters:**
- `search` (optional): Search term to filter categories

**Example:**
```bash
curl -X GET "http://localhost:1337/load-commerce-fields/search-categories?search=women"
```

#### 3. Get Products by Category
**Endpoint:** `GET /load-commerce-fields/commerce-products?categoryUid={uid}`

**Description:** Retrieves products for a specific category.

**Parameters:**
- `categoryUid` (required): Base64 encoded category UID

**Example:**
```bash
curl -X GET "http://localhost:1337/load-commerce-fields/commerce-products?categoryUid=Mw=="
```

**Sample Response:**
```json
[
  {
    "value": "24-MB01",
    "label": "Joust Duffle Bag",
    "price": 34,
    "image": "https://..."
  }
]
```

#### 4. Search Products
**Endpoint:** `GET /load-commerce-fields/search-products?search={term}`

**Description:** Search products across all categories.

**Parameters:**
- `search` (required): Search term for product name

**Example:**
```bash
curl -X GET "http://localhost:1337/load-commerce-fields/search-products?search=bag"
```

## 🛠️ Configuration

### GraphQL Endpoint Configuration

The plugin requires a Magento GraphQL endpoint. Configure it in your `config/plugins.ts`:

```typescript
export default ({ env }) => ({
  'load-commerce-fields': {
    enabled: true,
    resolve: './src/plugins/load-commerce-fields',
    config: {
      graphqlEndpoint: env('MAGENTO_GRAPHQL_ENDPOINT', 'https://your-default-endpoint.com/graphql')
    }
  }
});
```

## 🆕 Recent Optimizations (v2.0)

### ✅ What's New
- **Plug & Play Architecture**: No more `npm install` required in plugin directory
- **Native Fetch API**: Replaced axios with native fetch for better Node.js compatibility
- **Improved SSL Handling**: Automatic SSL certificate issue resolution for HTTPS endpoints
- **Node.js 20+ Support**: Fully tested and optimized for latest Node.js versions
- **Build System Fixes**: Resolved Vite/Rollup module resolution issues
- **Environment Variable Support**: Proper configuration through Strapi's env system

### 🔧 Technical Changes
- Moved `react-select` from plugin dependencies to main project peer dependencies
- Implemented Node.js specific fetch with SSL handling (`NODE_TLS_REJECT_UNAUTHORIZED`)
- Added proper HTTP headers (`Accept`, `User-Agent`) for API requests
- Hardcoded plugin metadata to avoid package.json build dependencies
- Enhanced error handling with detailed logging for debugging
- Created minimal plugin package.json for Strapi core compatibility

## 🚨 Troubleshooting

### Module not found errors
**Issue**: `Cannot find module 'react-select'`
**Solution**: Ensure `react-select` is installed in your main Strapi project, not in the plugin directory.

```bash
# Run in your main Strapi project root
npm install react-select@^5.10.1
```

### Categories/Products not loading
**Issue**: API endpoints return empty arrays
**Solutions**:
1. Check your `MAGENTO_GRAPHQL_ENDPOINT` environment variable
2. Verify the Magento GraphQL endpoint is accessible
3. Check Strapi console logs for detailed error messages
4. Test the endpoint directly: `curl -X POST your-endpoint -d '{"query":"{ categories { items { name } } }"}'`

### SSL Certificate issues
**Issue**: `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or similar SSL errors
**Solution**: The plugin automatically handles SSL issues by temporarily setting `NODE_TLS_REJECT_UNAUTHORIZED=0` for HTTPS requests.

### Empty Arrays Returned
**Issue**: API returns `[]` instead of data
**Solutions**:
1. Verify the category UID is correct (should be base64 encoded)
2. Check if the category actually contains products in Magento
3. Try different category UIDs (e.g., "Mw==" for Gear category)
4. Enable debug logging in `server/services/commerceCategoriesService.js`

### Build Errors
**Issue**: Vite/Rollup build failures
**Solution**: The plugin now uses hardcoded metadata to avoid build-time package.json resolution issues. If you still see errors, ensure you're using the latest version of the plugin.

### Network Timeouts
**Issue**: Requests timeout or take too long
**Solutions**:
1. Check your network connection to the Magento server
2. Verify the Magento GraphQL endpoint is responding
3. Consider adding custom timeout configurations if needed

## 📋 Requirements

- **Strapi**: v5.x
- **Node.js**: 20.x or higher
- **Dependencies**: `react-select` in main project
- **External API**: Magento GraphQL endpoint

### Verified Compatible Versions
- ✅ Strapi v5.0.0+  
- ✅ Node.js v20.x, v22.x
- ✅ react-select v5.10.1
- ✅ Magento 2.4.x GraphQL API

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Contributing

Found an issue or want to contribute? Please feel free to submit issues and pull requests.

---

**Made with ❤️ for the Strapi community**
