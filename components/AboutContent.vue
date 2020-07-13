<template>
  <v-card min-height="500" class="d-flex align-center justify-center pa-12">
    <div class="text-center">
      <div class="text-h5 grey--text text--darken-2 mx-6">
        <v-icon large>mdi-music-clef-treble</v-icon>
        Ogg Loop Editor
      </div>
      <div class="caption grey--text text-center mt-2">
        since 2020.07
      </div>
    </div>
    <v-divider vertical class="mx-8 my-12" />
    <div class="flex-grow-1 mx-4">
      <div class="d-flex align-center">
        <img src="~assets/otonosono.png" width="72" height="72" alt="音の園" />
        <div class="ml-4 grey--text text--darken-1">
          Sample Music by 音の園
          <div class="mt-1">
            <a
              href="http://oto-no-sono.com/"
              style="text-decoration: none;"
              target="_blank"
            >
              <v-icon color="grey">mdi-music</v-icon>
              <span class="grey--text text--darken-1">Tropical Beach</span>
            </a>
          </div>
        </div>
      </div>
      <div class="xx-libraries mt-8 grey--text text--darken-1">
        <div class="overline">Libraries</div>
        <a href="https://vuetifyjs.com/" target="_blank">Vuetify</a>
        ・
        <a href="https://wavesurfer-js.org/" target="_blank">wavesurfer.js</a>
        ・
        <a href="https://mutagen.readthedocs.io/en/latest/" target="_blank"
          >Mutagen</a
        >
        ・
        <a href="https://vercel.com/" target="_blank">Vercel</a>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  props: {},
}
</script>

<style scoped>
.xx-libraries a {
  text-decoration: none;
}
</style>
