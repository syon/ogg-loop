<template>
  <v-app dark>
    <v-app-bar extended dark flat>
      <v-toolbar-title>
        <v-icon>mdi-music-clef-treble</v-icon>
        Ogg Loop Editor
      </v-toolbar-title>
      <v-spacer />
      <v-dialog
        v-model="aboutDialog"
        width="800"
        overlay-color="cyan lighten-5"
      >
        <template v-slot:activator="{ on, attrs }">
          <cmd-btn icon v-bind="attrs" v-on="on">
            <v-icon color="cyan accent-4" @click.stop="aboutDialog = true">
              mdi-information-outline
            </v-icon>
            <template #tooltip>About</template>
          </cmd-btn>
        </template>
        <about-content />
      </v-dialog>
      <v-btn
        href="https://twitter.com/intent/tweet?hashtags=oggloop&amp;original_referer=http%3A%2F%2Flocalhost%3A3000%2F&amp;ref_src=twsrc%5Etfw&amp;text=Ogg%20Loop%20Editor&amp;tw_p=tweetbutton&amp;url=https%3A%2F%2Foggloop.vercel.app%2F"
        target="_blank"
        icon
        ><v-icon color="#1DA1F2">mdi-twitter</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <template v-if="isChrome">
          <nuxt />
        </template>
        <template v-else>
          <div class="screenshot-wrap">
            <img
              class="screenshot"
              src="/oggloop.png"
              alt="Ogg Loop Editor Screenshot"
            />
          </div>
          <div class="white--text text-body-2 text-center pb-12">
            Sorry, Ogg Loop Editor is currently only supported on the Google
            Chrome browser.
          </div>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import CmdBtn from '@/components/CmdBtn'
import AboutContent from '@/components/AboutContent'

export default {
  components: {
    CmdBtn,
    AboutContent,
  },
  data: () => ({
    aboutDialog: false,
  }),
  computed: {
    isChrome() {
      return this.$browserDetect.isChrome
    },
  },
}
</script>

<style>
#__layout > .theme--light.v-application {
  background-image: url(/sea.jpg);
}
#__layout > .theme--light.v-application .v-application--wrap {
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.2);
}
.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background-color: transparent !important;
}
.v-toolbar--prominent:not(.v-toolbar--bottom) .v-toolbar__title {
  padding-top: 6px;
  align-self: flex-start;
}
.screenshot-wrap {
  max-width: 800px;
  margin: auto;
}
.screenshot {
  width: 100%;
}
.v-overlay__scrim.cyan.lighten-5 {
  backdrop-filter: blur(50px);
}
</style>
