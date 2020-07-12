<template>
  <v-app dark>
    <v-app-bar extended dark flat>
      <v-toolbar-title>
        <v-icon>mdi-music-clef-treble</v-icon>
        OGG Loop Editor
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <template v-if="isChrome">
          <nuxt />
        </template>
        <template v-else>
          <div class="white--text text-h4">
            Sorry, OGG Loop Editor is currently only supported on the Google
            Chrome browser.
          </div>
        </template>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  computed: {
    isChrome() {
      return this.$browserDetect.isChrome
    },
  },
}
</script>

<style>
.theme--light.v-application {
  background-image: url(/sea.jpg);
}
.v-application--wrap {
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
</style>
