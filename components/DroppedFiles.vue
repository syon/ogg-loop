<template>
  <v-data-table
    :headers="headers"
    :items="droppedFiles"
    dense
    hide-default-footer
    class="elevation-1"
  />
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    headers: [
      { text: 'name', value: 'name' },
      { text: 'size', value: 'size' },
      { text: 'lastModifiedDate', value: 'lastModifiedDate' },
    ],
  }),
  computed: {
    ...mapGetters({
      droppedFiles: 'dropper/gFiles',
    }),
  },
}
</script>
