// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://a-bau.nexifyai.cloud',
  output: 'static',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  image: {
    service: { entrypoint: 'astro/assets' },
    formats: ['avif', 'webp'],
    defaultFormats: ['webp'],
  },
  integrations: [sitemap({
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date(),
    filter: (page) => !page.includes('/impressum') && !page.includes('/datenschutz'),
  })],
  vite: {
    build: {
      cssMinify: 'lightningcss',
    },
  },
});
