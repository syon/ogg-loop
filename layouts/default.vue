<template>
  <v-app>
    <v-app-bar extended dark flat>
      <v-toolbar-title class="text-white">
        <v-icon size="24">mdi-music-clef-treble</v-icon>
        Ogg Loop Editor
      </v-toolbar-title>
      <v-spacer />
      <v-dialog v-model="aboutDialog" width="800">
        <template #activator="{ props }">
          <cmd-btn icon v-bind="props">
            <v-icon color="cyan-accent-4" @click.stop="aboutDialog = true">
              mdi-information-outline
            </v-icon>
            <template #tooltip>About</template>
          </cmd-btn>
        </template>
        <about-content />
      </v-dialog>
      <v-btn
        href="https://twitter.com/intent/tweet?hashtags=oggloop&amp;ref_src=twsrc%5Etfw&amp;text=Ogg%20Loop%20Editor&amp;tw_p=tweetbutton&amp;url=https%3A%2F%2Foggloop.vercel.app%2F"
        target="_blank"
        icon
      >
        <v-icon color="#1DA1F2">mdi-twitter</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <template v-if="isAvailable">
          <slot />
        </template>
        <template v-else>
          <div class="screenshot-wrap">
            <img class="screenshot" src="/oggloop.png" alt="Ogg Loop Editor Screenshot" />
          </div>
          <div class="text-white text-body-2 text-center pb-12">
            Sorry, Ogg Loop Editor is not optimized for mobile phones. Please use a tablet or
            desktop with a modern browser (Chrome, Firefox, Edge, Safari, etc.).
          </div>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import CmdBtn from '@/components/CmdBtn'
import AboutContent from '@/components/AboutContent'

export default {
  components: {
    CmdBtn,
    AboutContent,
  },
  setup() {
    const aboutDialog = ref(false)

    // Modern browser detection
    const isAvailable = computed(() => {
      if (process.client) {
        // Check for Web Audio API support (required for WaveSurfer.js)
        const hasWebAudio = 'AudioContext' in window || 'webkitAudioContext' in window

        // Exclude mobile phones but allow tablets
        // Typical breakpoint: phones < 768px, tablets >= 768px
        const isMobilePhone = window.matchMedia('(max-width: 767px) and (pointer: coarse)').matches

        return hasWebAudio && !isMobilePhone
      }
      return true
    })

    return {
      aboutDialog,
      isAvailable,
    }
  },
}
</script>

<style>
body {
  background: #f8f8f8;
}
.v-application {
  background-image: url(/sea.jpg);
  background-size: cover;
}
.v-application .v-application__wrap {
  backdrop-filter: blur(5px);
  background: rgba(255, 255, 255, 0.2);
}
.v-app-bar.v-toolbar {
  background-color: transparent !important;
}
.v-toolbar--prominent:not(.v-toolbar--bottom) .v-toolbar__title {
  padding-top: 6px;
  align-self: flex-start;
}
.v-container {
  width: 100%;
  max-width: 100%;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;
}
.screenshot-wrap {
  max-width: 800px;
  margin: auto;
}
.screenshot {
  width: 100%;
}
</style>
