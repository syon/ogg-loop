<template>
  <v-app dark>
    <v-app-bar extended dark flat>
      <v-toolbar-title v-text="title" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'OGG Loop Editor',
    }
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
  background-color: transparent;
}
.v-toolbar--prominent:not(.v-toolbar--bottom) .v-toolbar__title {
  padding-top: 6px;
  align-self: flex-start;
}
</style>
