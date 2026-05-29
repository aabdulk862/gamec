import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://igamec.org',
  output: 'static',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('donation-receipts') &&
        !page.includes('sign-in') &&
        !page.includes('sign-up'),
    }),
  ],
  vite: {
    build: {
      cssMinify: true,
      minify: true,
    },
    server: {
      proxy: {
        '/api/quran-pdf': {
          target: 'https://pub-859f42e20e3a4f7bb6787dd54417300a.r2.dev',
          changeOrigin: true,
          rewrite: (path) => '/quran.pdf',
        },
      },
    },
  },
});
