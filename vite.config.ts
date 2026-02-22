import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    },
    headers: {
      'Content-Security-Policy': "img-src 'self' data: blob: https: http://localhost:8080 http://localhost:5173 https://*.amap.com http://*.amap.com; default-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.amap.com http://*.amap.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.amap.com http://*.amap.com; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:8080 https://*.amap.com http://*.amap.com; worker-src 'self' blob:;"
    }
  }
})
