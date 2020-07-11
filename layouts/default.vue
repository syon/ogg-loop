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
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

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
