import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
},
 preview: {
  host: '0.0.0.0',
  port: 20,
  allowHost: ['henlo.onrender.com']
 }

})
