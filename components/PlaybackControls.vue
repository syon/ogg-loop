<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '@/stores/appState'
import CmdBtn from '@/components/CmdBtn'

const appState = useAppStateStore()

const props = defineProps({
  isPlaying: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['playPause'])

const handlePlayPause = () => {
  emit('playPause')
}
</script>

<template>
  <div class="d-flex align-center">
    <cmd-btn :shortkey="['space']" @do="handlePlayPause">
      <template v-if="!isPlaying">
        <v-icon>mdi-play</v-icon>
      </template>
      <template v-else>
        <v-icon>mdi-pause</v-icon>
      </template>
      <template #tooltip>
        <span>Space</span>
      </template>
    </cmd-btn>
    <v-switch
      v-model="appState.loopEnabled"
      class="ml-6"
      hide-details
      label="Loop"
      color="primary"
      style="margin: 0"
    />
  </div>
</template>
