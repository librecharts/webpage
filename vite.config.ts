import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: 'vue/dist/vue.esm-bundler'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue', '@vueuse/core'],
          three: ['three'],
          globe: ['globe.gl'],
          pdfjs: ['pdfjs-dist'],
          logging: ['@sentry/vue', '@sentry/integrations']
        }
      }
    }
  }
})
