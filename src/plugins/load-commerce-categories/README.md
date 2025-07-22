# Load Commerce Categories - Strapi Plugin

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

Copy the entire `load-commerce-categories` folder to your Strapi project:

```
your-strapi-project/
├── src/
│   ├── plugins/
│   │   └── load-commerce-categories/    ← Copy this folder here
│   └── ...
├── package.json
└── ...
```

### Step 3: Configure Plugin

Add the plugin configuration to your `config/plugins.ts` file:

```typescript
export default {
  // ... other plugins
  'load-commerce-categories': {
    enabled: true,
    resolve: './src/plugins/load-commerce-categories',
    config: {
      graphqlEndpoint: 'https://your-magento-store.com/graphql'
    }
  },
};
```

### Step 4: Restart Strapi

```bash
npm run develop
```

## 🛠️ Configuration

Configure your Magento GraphQL endpoint in `config/plugins.ts`:

```typescript
'load-commerce-categories': {
  enabled: true,
  resolve: './src/plugins/load-commerce-categories',
  config: {
    graphqlEndpoint: 'https://your-magento-store.com/graphql'
  }
}
```

## 📝 Usage

### In Content Types

When creating or editing content types, you'll find these custom fields available:

#### 1. **Commerce Category** (Single Selection)
- Field type: Custom Field → Commerce Category
- Use for: Single category selection from Magento
- Data type: String (category UID)

#### 2. **Commerce Categories** (Multi Selection)
- Field type: Custom Field → Commerce Multi Category
- Use for: Multiple category selection with search
- Data type: JSON Array

#### 3. **Commerce Product** (Single/Multi Selection)
- Field type: Custom Field → Commerce Product
- Use for: Product selection with search
- Data type: String or JSON Array

#### 4. **Commerce Category + Products**
- Field type: Custom Field → Commerce Category Product
- Use for: Select category then products from that category
- Data type: JSON Object `{category: "uid", products: ["id1", "id2"]}`

### API Response Examples

#### Single Category
```json
{
  "category": "Mw=="
}
```

#### Multiple Categories
```json
{
  "categories": ["Mw==", "Ng==", "OA=="]
}
```

#### Products
```json
{
  "products": ["24-MB01", "24-MB04", "24-MB03"]
}
```

#### Category + Products
```json
{
  "category_products": {
    "category": "Mw==",
    "products": ["24-MB01", "24-MB04"]
  }
}
```

## 🔧 API Endpoints

The plugin exposes these REST API endpoints for integration:

### Categories

#### Get All Categories
```http
GET /load-commerce-categories/commerce-categories
```
**Response Example:**
```json
[
  {"label":"What's New","value":"Mzg=","level":2},
  {"label":"— New dummy category","value":"NDM=","level":3},
  {"label":"Women","value":"MjA=","level":2},
  {"label":"— Tops","value":"MjE=","level":3},
  {"label":"—— Jackets","value":"MjM=","level":4},
  {"label":"Men","value":"MTE=","level":2},
  {"label":"Gear","value":"Mw==","level":2}
]
```

#### Search Categories
```http
GET /load-commerce-categories/search-categories?query=women
```
**Response:** Filtered categories matching the search term

### Products

#### Get Products by Category
```http
GET /load-commerce-categories/commerce-products?categoryUid=Mw==
```
**Response Example:**
```json
[
  {"label":"Set of Sprite Yoga Straps","value":"24-WG085_Group"},
  {"label":"Sprite Yoga Companion Kit","value":"24-WG080"},
  {"label":"Didi Sport Watch","value":"24-WG02"},
  {"label":"Bolo Sport Watch","value":"24-WG01"}
]
```

#### Search Products by Name
```http
GET /load-commerce-categories/search-products?query=shirt
```
**Response Example:**
```json
[
  {"label":"Troy Yoga Short","value":"MSH09"},
  {"label":"Bruno Compete Hoodie","value":"MH03"},
  {"label":"Apollo Running Short","value":"MSH02"}
]
```

### Testing Endpoints

You can test the endpoints directly using curl:

```bash
# Get all categories
curl "http://localhost:1337/load-commerce-categories/commerce-categories"

# Search for categories containing "gear"  
curl "http://localhost:1337/load-commerce-categories/search-categories?query=gear"

# Get products from Gear category
curl "http://localhost:1337/load-commerce-categories/commerce-products?categoryUid=Mw=="

# Search for products containing "watch"
curl "http://localhost:1337/load-commerce-categories/search-products?query=watch"
```

## 🔍 Troubleshooting

### "Module not found" errors
Make sure you installed `react-select` in your main project:
```bash
npm install react-select@^5.10.1
```

### Categories/Products not loading
1. Check your Magento GraphQL endpoint in `config/plugins.ts`
2. Ensure your Magento store allows GraphQL queries
3. Test endpoints directly using curl (see API Endpoints section)
4. Check Strapi server logs for detailed error messages

### Testing Plugin Functionality

Verify all endpoints are working:

```bash
# Test categories (should return hierarchical list)
curl "http://localhost:1337/load-commerce-categories/commerce-categories"

# Test search (should filter results)  
curl "http://localhost:1337/load-commerce-categories/search-categories?query=gear"

# Test products by category (use category UID from categories response)
curl "http://localhost:1337/load-commerce-categories/commerce-products?categoryUid=Mw=="

# Test product search (should return matching products)
curl "http://localhost:1337/load-commerce-categories/search-products?query=watch"
```

### SSL Certificate issues
The plugin automatically handles SSL certificate issues by temporarily setting `NODE_TLS_REJECT_UNAUTHORIZED=0` during requests. This is restored after each request to maintain security.

### Common Issues

**Empty Arrays Returned**: 
- Check if the category has products assigned in Magento
- Verify category UIDs are correct (they are base64 encoded)
- Ensure GraphQL endpoint is accessible

**Build Errors**:
- Ensure `react-select` is installed in main project, not plugin directory
- Clear Strapi build cache: `rm -rf .strapi/` and restart

**Network Timeouts**:
- Check Magento server response time
- Verify firewall settings allow outbound HTTPS requests

## 🏗️ Development

### Plugin Structure
```
load-commerce-categories/
├── admin/                     # Frontend components
│   └── src/
│       └── components/
│           ├── CommerceCategoryInput/           # Single category
│           ├── CommerceMultiCategoryInput/      # Multi category  
│           ├── CommerceProductInput/            # Product selection
│           └── CommerceCategoryProductInput/    # Combined
├── server/                    # Backend logic
│   ├── controllers/
│   ├── routes/
│   └── services/
├── strapi-admin.js           # Admin panel integration
├── strapi-server.js          # Server integration
└── README.md
```

### Magento GraphQL Queries

The plugin uses these GraphQL queries:

**Categories:**
```graphql
{
  categories(filters: { parent_id: { eq: "2" } }) {
    items {
      uid
      name
      level
      include_in_menu
      children { ... }
    }
  }
}
```

**Products:**
```graphql
{
  products(filter: { category_uid: { eq: "categoryUid" } }) {
    items {
      id: sku
      name
    }
  }
}
```

## 📋 Requirements

- **Strapi**: v5.x
- **Node.js**: 20+ (optimized and tested)
- **Magento**: 2.4+ with GraphQL enabled
- **Dependencies**: `react-select@^5.10.1` in main project (not in plugin)

### Verified Compatible Versions
- ✅ Node.js 20.x
- ✅ Strapi 5.15.0
- ✅ Magento 2.4.x GraphQL
- ✅ react-select 5.10.1

## 🔄 Migration from Previous Versions

If upgrading from a version that required separate npm install:

1. Delete `node_modules` in the plugin directory
2. Install `react-select` in main project
3. Copy updated plugin files
4. Restart Strapi

## 🚀 Recent Optimizations (v2.0)

This version has been completely optimized for a "plug and play" experience:

### ✅ What We Fixed

- **Removed External Dependencies**: Eliminated `axios`, `prop-types` dependencies from plugin
- **Native Fetch Implementation**: Replaced axios with modern fetch API for HTTP requests
- **SSL Certificate Handling**: Automatic SSL certificate issue resolution for HTTPS endpoints
- **React-Select Integration**: Moved to main project dependencies for better compatibility
- **Direct Imports**: Removed dynamic imports in favor of direct imports for better performance
- **Build Compatibility**: Fixed Rollup/Vite build issues with `@strapi/helper-plugin`
- **Node.js 20+ Support**: Fully compatible with latest Node.js versions

### 🔧 Technical Changes

1. **Server Services**: Updated all GraphQL requests to use fetch instead of axios
2. **Admin Components**: Direct import of react-select instead of lazy loading
3. **Package Management**: Minimal plugin package.json with only metadata
4. **Error Handling**: Enhanced error reporting with detailed HTTP response information
5. **SSL Support**: Automatic `NODE_TLS_REJECT_UNAUTHORIZED` handling for development

### 🎯 Performance Improvements

- **Faster Loading**: No dynamic imports reduce component load time
- **Better Caching**: Native fetch with proper headers for better HTTP caching
- **Reduced Bundle Size**: No duplicate dependencies in plugin directory
- **Improved Error Messages**: Detailed logging for debugging connection issues

## 📞 Support

- Check network requests in browser developer tools
- Verify Magento GraphQL endpoint accessibility
- Ensure proper Strapi permissions for custom fields

---

Made with ❤️ for Strapi and Magento integration
