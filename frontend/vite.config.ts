import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// @ts-expect-error - El módulo existe en el contenedor de Docker
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Expone el puerto para Docker
    port: 5173,
    watch: {
      usePolling: true // Fuerza a Docker a detectar tus cambios guardados
    }
  }
})