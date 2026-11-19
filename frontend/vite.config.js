import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite (ferramenta de desenvolvimento para React)
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Redireciona requisições /api diretamente para o backend na porta 3001
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
