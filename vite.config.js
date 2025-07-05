import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    host: '0.0.0.0', // เพิ่มบรรทัดนี้
    port: 3000,      // (ไม่บังคับ) ตรวจสอบให้แน่ใจว่าเป็นพอร์ตเดียวกับที่คุณแมปใน docker-compose.yml
  },
  css: {
    postcss: './postcss.config.cjs',
  },
})
