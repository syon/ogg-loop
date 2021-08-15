import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Ogg Loop Editor',
    htmlAttrs: {
      prefix: 'og: http://ogp.me/ns#',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'format-detection', content: 'telephone=no' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content:
          'Shows audio .ogg waveform, you can find loop points easily. Then write meta data of loop info (Vorbis Comment) into the file.',
      },
      {
        hid: 'og:site_name',
        property: 'og:site_name',
        content: 'Ogg Loop Editor',
      },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://oggloop.vercel.app/',
      },
      { hid: 'og:title', property: 'og:title', content: 'Ogg Loop Editor' },
      {
        hid: 'og:description',
        property: 'og:description',
        content:
          'Shows audio .ogg waveform, you can find loop points easily. Then write meta data of loop info (Vorbis Comment) into the file.',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content: 'https://oggloop.vercel.app/oggloop.png',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  env: {
    DISCORD_WEBHOOK:
      'https://discord.com/api/webhooks/795600132229300274/kgSevzKqzXdqBZrCiVCrUWXPNxD4vFzBU7CXXy9qpiFTQfFdriJSvirqqXpDBenvGD1y',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [{ src: '@/plugins/vue-shortkey.js', mode: 'client' }],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    'vue-browser-detect-plugin/nuxt',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-37634759-17',
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: colors.cyan,
          accent: colors.yellow.lighten1,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
}
