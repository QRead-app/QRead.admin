import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  server: {
    https: {
      key: fs.readFileSync('../QRead.backend/certs/key.pem'),
      cert: fs.readFileSync('../QRead.backend/certs/cert.cer'),
    }
  }
})
