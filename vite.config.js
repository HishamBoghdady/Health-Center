import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:
  {
    port: 3000,// ✅ عدل هذا الرقم للمنفذ الذي تريده
    open: true,// 🔁 لفتح المتصفح تلقائيًا عند تشغيل dev server
  },
})
