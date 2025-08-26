
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Adiciona a base path do repositório para o deploy no GitHub Pages
  base: '/arkhamstudio-plataform/', 
  plugins: [react()],
})
