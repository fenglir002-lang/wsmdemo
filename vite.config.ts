import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
// 注意：必须是 /wsmdemo/，前后都要有斜杠
base: '/',
})
