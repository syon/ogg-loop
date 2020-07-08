<template>
  <VueFullScreenFileDrop @drop="onDrop" />
</template>

<script>
import VueFullScreenFileDrop from 'vue-full-screen-file-drop'
import 'vue-full-screen-file-drop/dist/vue-full-screen-file-drop.css'

export default {
  components: {
    VueFullScreenFileDrop,
  },
  methods: {
    onDrop(formData, files) {
      console.log({ formData, files })
      this.$store.dispatch('dropper/load', Array.from(files))
    },
  },
}
</script>
