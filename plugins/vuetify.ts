import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#00BCD4', // cyan
            accent: '#FFFF8D', // yellow.lighten1
            secondary: '#FF6F00', // amber.darken3
            info: '#26A69A', // teal.lighten1
            warning: '#FFC107', // amber.base
            error: '#FF3D00', // deepOrange.accent4
            success: '#00E676', // green.accent3
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
