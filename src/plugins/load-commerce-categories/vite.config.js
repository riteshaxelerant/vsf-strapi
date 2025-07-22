import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [
        '@strapi/design-system',
        '@strapi/helper-plugin',
        '@strapi/icons',
        'react',
        'react-dom',
        'react-router-dom',
        'styled-components',
        'react-intl',
        'axios'
      ]
    }
  }
}); 