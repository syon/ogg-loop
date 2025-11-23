<template>
  <v-data-table
    :headers="headers"
    :items="droppedFiles"
    density="compact"
    hide-default-footer
    class="elevation-1"
  />
</template>

<script>
import { useDropperStore } from '@/stores/dropper'

export default {
  setup() {
    const dropperStore = useDropperStore()
    return {
      dropperStore,
    }
  },
  data: () => ({
    headers: [
      { title: 'name', key: 'name' },
      { title: 'size', key: 'size' },
      { title: 'lastModified', key: 'lastModified' },
    ],
  }),
  computed: {
    droppedFiles() {
      const fileInfo = this.dropperStore.gFileInfo
      return fileInfo && fileInfo.name ? [fileInfo] : []
    },
  },
}
</script>
