<template>
  <v-app dark>
    <v-app-bar extended flat color="primary" dark>
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
.v-main__wrap {
  /* background-color: #f8f8f8; */
}
</style>
