import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Client } from 'appwrite';

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
})
