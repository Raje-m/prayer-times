import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'تطبيق مواقيت الصلاة والذكر',
        short_name: 'مواقيت الصلاة',
        description: 'تطبيق إسلامي لمواقيت الصلاة، الأذكار، القبلة، والمسبحة الرقمية',
        theme_color: '#0B1328',
        background_color: '#0B1328',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }),
    babel( { presets: [ reactCompilerPreset() ] } ),
     tailwindcss(),
  ],
})
