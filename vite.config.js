import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      // تضمين ملف الأذان والأيقونات في الأصول الثابتة
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'adhan.mp3'],
      workbox: {
        // 1. إجبار Workbox على تخزين ملفات الصوت (mp3) مسبقاً مع ملفات البناء
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3}'],
        // 2. زيادة الحد الأقصى لحجم الملف المسموح بتخزينه (افتراضياً 2MB، نرفعه إلى 10MB تحسباً لحجم ملف الأذان)
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // 3. دعم تشغيل الصوت الجزئي (Range Requests) الضروري لعمل الصوت أوفلاين على المتصفحات والآيفون
        runtimeCaching: [
          {
            urlPattern: /\.mp3$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'adhan-audio-cache',
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 365, // الاحتفاظ بالملف لمدة عام
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
              rangeRequests: true,
            },
          },
        ],
      },
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
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
})