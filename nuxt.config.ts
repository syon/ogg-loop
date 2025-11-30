// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-23',

  // Disable server-side rendering (SPA mode)
  ssr: false,

  devtools: { enabled: true },

  // Global page headers
  app: {
    head: {
      title: 'Ogg Loop Editor',
      htmlAttrs: {
        prefix: 'og: http://ogp.me/ns#',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          key: 'description',
          name: 'description',
          content:
            'Shows audio .ogg waveform, you can find loop points easily. Then write meta data of loop info (Vorbis Comment) into the file.',
        },
        {
          key: 'og:site_name',
          property: 'og:site_name',
          content: 'Ogg Loop Editor',
        },
        { key: 'og:type', property: 'og:type', content: 'website' },
        {
          key: 'og:url',
          property: 'og:url',
          content: 'https://oggloop.vercel.app/',
        },
        { key: 'og:title', property: 'og:title', content: 'Ogg Loop Editor' },
        {
          key: 'og:description',
          property: 'og:description',
          content:
            'Shows audio .ogg waveform, you can find loop points easily. Then write meta data of loop info (Vorbis Comment) into the file.',
        },
        {
          key: 'og:image',
          property: 'og:image',
          content: 'https://oggloop.vercel.app/oggloop.png',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' },
      ],
    },
  },

  // Runtime config (replaces env)
  runtimeConfig: {
    public: {
      discordWebhook:
        'https://discord.com/api/webhooks/795600132229300274/kgSevzKqzXdqBZrCiVCrUWXPNxD4vFzBU7CXXy9qpiFTQfFdriJSvirqqXpDBenvGD1y',
      googleAnalyticsId: 'UA-37634759-17',
    },
  },

  // Global CSS
  css: ['vuetify/styles'],

  // Modules
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@vite-pwa/nuxt', 'nuxt-gtag'],

  // Development proxy for API
  nitro: {
    devProxy: {
      '/api': {
        target: 'http://localhost:3001/api',
        changeOrigin: true,
        prependPath: true,
      },
    },
  },

  // Build configuration
  build: {},

  // Vite configuration
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    ssr: {
      noExternal: ['vuetify'],
    },
    optimizeDeps: {
      include: ['vue3-shortkey'],
    },
  },
})
