<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStateStore } from '@/stores/appState'
import DropZone from '@/components/DropZone'
import CmdBtn from '@/components/CmdBtn'
import AudioControls from '@/components/AudioControls'
import LoopInfo from '@/components/LoopInfo'
import FileToolbar from '@/components/FileToolbar'
import WaveformTimeline from '@/components/WaveformTimeline'

const appState = useAppStateStore()

// Reactive state
const waveformRef = ref(null)

// Lifecycle
onMounted(async () => {
  await applySampleAudio()
})

// Computed properties
const isPlaying = computed(() => waveformRef.value?.isPlaying())

// Methods
const applySampleAudio = async () => {
  const url = `${location.origin}/TropicalBeach.ogg`
  const blob = await $fetch(url, { responseType: 'blob' })
  const file = new File([blob], 'TropicalBeach.ogg', { type: 'audio/ogg' })
  // Set metadata BEFORE loading file
  appState.setMetadata({ LOOPSTART: 5488074, LOOPLENGTH: 3080139 })
  // Load file with metadata preservation
  await appState.load([file], true)
}

const playPause = () => {
  waveformRef.value?.playPause()
}

const handleSkip = (offset) => {
  waveformRef.value?.skip(offset)
}

const handleRepeat = (offset) => {
  if (waveformRef.value && appState.gRegion) {
    const sec = appState.gRegion.end - offset
    waveformRef.value.play(sec)
  }
}
</script>

<template>
  <v-card class="LoopEditor pa-8" min-height="85vh">
    <drop-zone />

    <FileToolbar />

    <v-divider class="my-6" />

    <AudioControls @handle-skip="handleSkip" @handle-repeat="handleRepeat" />

    <div class="d-flex align-center justify-center my-6">
      <div class="d-flex align-center">
        <cmd-btn :shortkey="['space']" @do="playPause">
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

      <v-divider vertical class="mx-8 my-4" />

      <LoopInfo />
    </div>

    <WaveformTimeline ref="waveformRef" />

    <v-overlay :model-value="appState.gLoading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
  </v-card>
</template>

<style>
.LoopEditor {
  width: 100%;
  margin-top: -64px;
}
</style>
