import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // 可以指定端口
    open: true  // 自动打开浏览器
  }
})