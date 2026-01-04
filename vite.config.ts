import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用 GitHub Pages 默认地址：/wsmdemo/
  base: '/wsmdemo/',
})
