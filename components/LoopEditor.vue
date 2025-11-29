<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import FileDownload from 'js-file-download'
import { useAppStateStore } from '@/stores/appState'
import DropZone from '@/components/DropZone'
import CmdBtn from '@/components/CmdBtn'
import AudioControls from '@/components/AudioControls'
import LoopInfo from '@/components/LoopInfo'
import FileToolbar from '@/components/FileToolbar'
import WaveformTimeline from '@/components/WaveformTimeline'
import Ogg from '@/lib/Ogg'

const appState = useAppStateStore()

// Reactive state
const myfile = ref(null)
const waveformRef = ref(null)

// Lifecycle
onMounted(async () => {
  await applySampleAudio()
})

// Watchers
watch(myfile, () => {
  // Only clear metadata if it's a user-selected file (not programmatic load)
  if (myfile.value && !appState.gMetadataReady) {
    appState.clearMetadata()
  }
})

watch(
  () => appState.gLastLoaded,
  () => {
    myfile.value = appState.gFile
  },
)

// Computed properties
const isPlaying = computed(() => waveformRef.value && waveformRef.value.isPlaying())

// Methods
const applySampleAudio = async () => {
  const url = `${location.origin}/TropicalBeach.ogg`
  const blob = await $fetch(url, { responseType: 'blob' })
  const file = new File([blob], 'TropicalBeach.ogg', { type: 'audio/ogg' })
  // Set metadata BEFORE loading file
  appState.setMetadata({ LOOPSTART: 5487730, LOOPLENGTH: 3080921 })
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

const changeZoom = (operation) => {
  appState.changeZoom(operation)
  waveformRef.value?.zoom(Number(appState.gZoom))
}

const changeSpeed = (v) => {
  appState.setSpeed(v)
  waveformRef.value?.setPlaybackRate(Number(v))
}

const syncFormToRegion = () => {
  if (!appState.gRegion || !waveformRef.value) return
  appState.syncFormToRegion()
  waveformRef.value.updateRegion(appState.gFormLoopStartSeconds, appState.gFormLoopEndSeconds)
}

const handleScanOgg = async () => {
  appState.setLoading(true)
  try {
    const meta = await Ogg.scan(myfile.value)
    appState.setMetadata(meta)
    // Update store with the scanned file
    await appState.load([myfile.value])
  } catch (e) {
    alert('Scan Error.')
  }
  appState.setLoading(false)
}

const handleSubmit = async () => {
  appState.setLoading(true)
  try {
    const data = await Ogg.write({
      myfile: myfile.value,
      loopstart: appState.formLoopStartSample,
      looplength: appState.formLoopLengthSample,
    })
    const filename = `${appState.gFileInfo.name.replace('.ogg', '')}_(Loop).ogg`
    FileDownload(data, filename)
  } catch (e) {
    alert('Write Error.')
  }
  appState.setLoading(false)
}
</script>

<template>
  <v-card class="LoopEditor pa-8" min-height="85vh">
    <drop-zone />

    <file-toolbar
      v-model:myfile="myfile"
      v-model:form-loop-start-sample="appState.formLoopStartSample"
      v-model:form-loop-length-sample="appState.formLoopLengthSample"
      :meta-ready="appState.gMetadataReady"
      :meta="appState.gMetadata"
      @handle-scan-ogg="handleScanOgg"
      @handle-submit="handleSubmit"
      @sync-form-to-region="syncFormToRegion"
    />

    <v-divider class="my-6" />

    <AudioControls
      v-model:speed-val="appState.speed"
      v-model:volume-val="appState.volume"
      @change-zoom="changeZoom"
      @change-speed="changeSpeed"
      @handle-skip="handleSkip"
      @handle-repeat="handleRepeat"
    />

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
          style="margin: 0"
        />
      </div>

      <v-divider vertical class="mx-8 my-4" />

      <LoopInfo />
    </div>

    <WaveformTimeline
      ref="waveformRef"
      :file-buffer="appState.gFileBuffer"
      :loop="appState.gLoopEnabled"
      :volume-val="appState.gVolume"
    />

    <v-overlay :value="appState.gLoading">
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
