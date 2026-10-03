import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // registerType: 'autoUpdate' faz o celular baixar sozinho
      // qualquer atualização futura do app, sem o usuário precisar
      // desinstalar e instalar de novo.
      registerType: 'autoUpdate',
      manifest: {
        name: 'Onde tem vaga',
        short_name: 'OndeTemVaga',
        description: 'Encontre hospitais e UPAs com menos espera perto de você',
        theme_color: '#0F5C4F',
        background_color: '#EEF2F0',
        display: 'standalone',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})