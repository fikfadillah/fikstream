import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Saat dev (localhost), /api/proxy diteruskan langsung ke API asli
      // Ini meniru perilaku Netlify Function di production
      '/api/proxy': {
        target: 'https://foodcash.com.br',
        changeOrigin: true,
        rewrite: (path) => {
          // Ubah /api/proxy?action=... → /sistema/apiv4/api.php?action=...
          return path.replace('/api/proxy', '/sistema/apiv4/api.php');
        },
      },
    },
  },
})
