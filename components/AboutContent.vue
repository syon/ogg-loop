<template>
  <v-card min-height="500" class="d-flex flex-row align-center justify-center pa-12">
    <div class="text-center">
      <div class="text-h5 text-grey-darken-1 mx-6">
        <v-icon size="36">mdi-music-clef-treble</v-icon>
        Ogg Loop Editor
      </div>
      <div class="text-caption text-grey text-center mt-2">since 2020.07</div>
    </div>
    <v-divider vertical class="mx-8 my-12" />
    <div class="flex-grow-1 mx-4">
      <div class="d-flex align-center">
        <img src="/otonosono.png" width="72" height="72" alt="音の園" />
        <div class="ml-4 text-grey-darken-1">
          Sample Music by 音の園
          <div class="mt-1">
            <a
              href="http://oto-no-sono.com/"
              style="text-decoration: none"
              target="_blank"
              class="text-cyan"
            >
              <v-icon color="grey" start>mdi-music</v-icon>
              <span class="text-grey-darken-1">Tropical Beach</span>
            </a>
          </div>
        </div>
      </div>
      <div class="xx-libraries mt-8 text-grey-darken-1">
        <div class="text-overline">Frontend</div>
        <a href="https://nuxtjs.org/" target="_blank" class="text-cyan">Nuxt.js</a>
        ・
        <a href="https://vuetifyjs.com/" target="_blank" class="text-cyan">Vuetify</a>
        ・
        <a href="https://wavesurfer.xyz/" target="_blank" class="text-cyan">wavesurfer.js</a>

        <div class="text-overline mt-4">Backend</div>
        <a href="https://vercel.com/" target="_blank" class="text-cyan">Vercel</a>
        ・
        <a href="https://mutagen.readthedocs.io/en/latest/" target="_blank" class="text-cyan">
          Mutagen
        </a>
      </div>
    </div>
  </v-card>
</template>

<style>
.xx-libraries a {
  text-decoration: none;
}

.v-overlay__scrim {
  background-color: #e0f7fa;
}
</style>
