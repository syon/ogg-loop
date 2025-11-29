<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
const zoomVal = ref(0)
const volumeVal = ref(50)
const speedVal = ref(1.0)
const waveformRef = ref(null)
const meta = ref({})
const metaReady = ref(false)
const loading = ref(false)
const loop = ref(true)

// Computed properties
const isPlaying = computed(
  () => waveformRef.value && waveformRef.value.isPlaying(),
)

// Watchers
watch(myfile, () => {
  metaReady.value = false
})

watch(
  () => appState.gLastLoaded,
  () => {
    metaReady.value = false
    refresh()
  },
)

// Methods
const applySampleAudio = async () => {
  const url = `${location.origin}/TropicalBeach.ogg`
  const blob = await $fetch(url, { responseType: 'blob' })
  const file = new File([blob], 'TropicalBeach.ogg', { type: 'audio/ogg' })
  meta.value = { LOOPSTART: 5487730, LOOPLENGTH: 3080921 }
  await appState.load([file])
  metaReady.value = true
}

const refresh = () => {
  myfile.value = appState.gFile
}

const playPause = () => {
  if (waveformRef.value) {
    waveformRef.value.playPause()
  }
}

const handleSkip = (offset) => {
  if (waveformRef.value) {
    waveformRef.value.skip(offset)
  }
}

const handleRepeat = (offset) => {
  if (waveformRef.value && appState.gRegion) {
    const sec = appState.gRegion.end - offset
    waveformRef.value.play(sec)
  }
}

const changeZoom = (sub) => {
  switch (sub) {
    case 'minus':
      zoomVal.value = zoomVal.value <= 20 ? 0 : zoomVal.value - 20
      break
    case 'plus':
      zoomVal.value += 20
      break
    default:
      zoomVal.value = 0
      break
  }
  if (waveformRef.value) {
    waveformRef.value.zoom(Number(zoomVal.value))
  }
}

const changeSpeed = (v) => {
  speedVal.value = v
  if (waveformRef.value) {
    waveformRef.value.setPlaybackRate(Number(v))
  }
}

const syncFormToRegion = () => {
  if (!appState.gRegion || !waveformRef.value) return
  const start = Number(appState.formLoopStartSample) / 44100
  const end =
    (Number(appState.formLoopStartSample) + Number(appState.formLoopLengthSample)) /
    44100
  waveformRef.value.updateRegion(start, end)
  // Update store as well
  appState.updateRegionByForm(
    Number(appState.formLoopStartSample),
    Number(appState.formLoopLengthSample),
  )
}

const handleScanOgg = async () => {
  loading.value = true
  try {
    meta.value = await Ogg.scan(myfile.value)
    // Update store with the scanned file
    await appState.load([myfile.value])
  } catch (e) {
    alert('Scan Error.')
  }
  metaReady.value = true
  loading.value = false
}

const handleSubmit = async () => {
  loading.value = true
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
  loading.value = false
}

// Lifecycle
onMounted(async () => {
  await applySampleAudio()
})
</script>

<template>
  <v-card class="LoopEditor pa-8" min-height="85vh">
    <drop-zone />

    <file-toolbar
      v-model:myfile="myfile"
      v-model:form-loop-start-sample="appState.formLoopStartSample"
      v-model:form-loop-length-sample="appState.formLoopLengthSample"
      :meta-ready="metaReady"
      :meta="meta"
      @handle-scan-ogg="handleScanOgg"
      @handle-submit="handleSubmit"
      @sync-form-to-region="syncFormToRegion"
    />

    <v-divider class="my-6" />

    <audio-controls
      v-model:speed-val="speedVal"
      v-model:volume-val="volumeVal"
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
          v-model="loop"
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
      :loopstart="meta.LOOPSTART"
      :looplength="meta.LOOPLENGTH"
      :loop="loop"
      :volume-val="volumeVal"
    />

    <v-overlay :value="loading">
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
