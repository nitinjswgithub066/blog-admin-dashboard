import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The public Vercel project proxies /admin/* to this deployment.
export default defineConfig({
  base: '/admin/',
  plugins: [react()],
})
