<template>
  <div
    ref="dropZoneRef"
    :class="{ 'drop-zone-active': isOverDropZone }"
    class="drop-zone"
  >
    <div v-if="isOverDropZone" class="drop-zone-overlay">
      <v-icon size="64" color="white">mdi-file-music</v-icon>
      <div class="text-h5 white--text mt-4">Drop OGG file here</div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useDropZone } from '@vueuse/core'
import { useAppStateStore } from '@/stores/appState'

export default {
  setup() {
    const dropZoneRef = ref(null)
    const appState = useAppStateStore()

    const onDrop = (files) => {
      if (files && files.length > 0) {
        console.log({ files })
        appState.load(Array.from(files))
      }
    }

    const { isOverDropZone } = useDropZone(dropZoneRef, {
      onDrop,
      dataTypes: ['audio/ogg'],
    })

    return {
      dropZoneRef,
      isOverDropZone,
    }
  },
}
</script>

<style scoped>
.drop-zone {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1000;
}

.drop-zone-active {
  pointer-events: all;
}

.drop-zone-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 188, 212, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
