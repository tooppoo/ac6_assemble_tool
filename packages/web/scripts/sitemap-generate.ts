import { createSitemap } from 'svelte-sitemap/src'

import { appUrl } from '../src/lib/app-url'

createSitemap(appUrl(), {
  outDir: 'dist',
  resetTime: true,
  ignore: ['google*', '404*'],
})
