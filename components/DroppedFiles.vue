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
import { useAppStateStore } from '@/stores/appState'

export default {
  setup() {
    const appState = useAppStateStore()
    return {
      appState,
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
      const fileInfo = this.appState.gFileInfo
      return fileInfo && fileInfo.name ? [fileInfo] : []
    },
  },
}
</script>
