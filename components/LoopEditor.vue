<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import FileDownload from 'js-file-download'
import { useDropperStore } from '@/stores/dropper'
import DropZone from '@/components/DropZone'
import CmdBtn from '@/components/CmdBtn'
import AudioControls from '@/components/AudioControls'
import LoopInfo from '@/components/LoopInfo'
import FileToolbar from '@/components/FileToolbar'
import WaveformTimeline from '@/components/WaveformTimeline'
import Ogg from '@/lib/Ogg'

const dropperStore = useDropperStore()

// Reactive state
const myfile = ref(null)
const audioprocess = ref(0)
const zoomVal = ref(0)
const volumeVal = ref(50)
const speedVal = ref(1.0)
const waveformRef = ref(null)
const meta = ref({})
const metaReady = ref(false)
const loading = ref(false)
const loop = ref(true)
const formLoopStartSample = ref(null)
const formLoopLengthSample = ref(null)

// Computed properties
const gFile = computed(() => dropperStore.gFile)
const gLastLoaded = computed(() => dropperStore.gLastLoaded)
const gFileInfo = computed(() => dropperStore.gFileInfo)
const gFileBuffer = computed(() => dropperStore.gFileBuffer)

const currentSample = computed(() => Math.round(audioprocess.value * 44100))
const currentTime = computed(() => formatTime(audioprocess.value))

const region = ref({})

const sampleStart = computed(() => {
  if (region.value) {
    const crr = region.value.start
    return Math.round(crr * 44100)
  }
  return ''
})

const sampleStartTime = computed(() => {
  if (region.value) {
    return formatTime(region.value.start)
  }
  return ''
})

const sampleEnd = computed(() => {
  if (region.value) {
    const crr = region.value.end
    return Math.round(crr * 44100)
  }
  return ''
})

const sampleEndTime = computed(() => {
  if (region.value) {
    return formatTime(region.value.end)
  }
  return ''
})

const looplengthSample = computed(() => sampleEnd.value - sampleStart.value)
const looplengthTime = computed(() =>
  formatTime(looplengthSample.value / 44100),
)
const isPlaying = computed(
  () => waveformRef.value && waveformRef.value.isPlaying(),
)

// Watchers
watch(myfile, () => {
  metaReady.value = false
})

watch(gLastLoaded, () => {
  metaReady.value = false
  refresh()
})

// Methods
const formatTime = (v) => {
  let sec = v
  if (!v) sec = 0
  return new Date(sec * 1000).toISOString().slice(14, -1)
}

const applySampleAudio = async () => {
  const url = `${location.origin}/TropicalBeach.ogg`
  const blob = await $fetch(url, { responseType: 'blob' })
  const file = new File([blob], 'TropicalBeach.ogg', { type: 'audio/ogg' })
  meta.value = { LOOPSTART: 5487730, LOOPLENGTH: 3080921 }
  await dropperStore.load([file])
  metaReady.value = true
}

const refresh = () => {
  myfile.value = gFile.value
}

const handleRegionUpdate = (newRegion) => {
  region.value = newRegion
  syncRegionToForm()
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
  if (waveformRef.value && region.value) {
    const sec = region.value.end - offset
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

const syncRegionToForm = () => {
  formLoopStartSample.value = Math.round(region.value.start * 44100)
  formLoopLengthSample.value = Math.round(
    (region.value.end - region.value.start) * 44100,
  )
}

const syncFormToRegion = () => {
  if (!region.value || !waveformRef.value) return
  const start = Number(formLoopStartSample.value) / 44100
  const end =
    (Number(formLoopStartSample.value) + Number(formLoopLengthSample.value)) /
    44100
  waveformRef.value.updateRegion(start, end)
}

const handleScanOgg = async () => {
  loading.value = true
  try {
    meta.value = await Ogg.scan(myfile.value)
    // Update store with the scanned file
    await dropperStore.load([myfile.value])
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
      loopstart: formLoopStartSample.value,
      looplength: formLoopLengthSample.value,
    })
    const filename = `${gFileInfo.value.name.replace('.ogg', '')}_(Loop).ogg`
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
      v-model:form-loop-start-sample="formLoopStartSample"
      v-model:form-loop-length-sample="formLoopLengthSample"
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

      <loop-info
        :current-time="currentTime"
        :current-sample="currentSample"
        :sample-start-time="sampleStartTime"
        :sample-start="sampleStart"
        :looplength-time="looplengthTime"
        :looplength-sample="looplengthSample"
        :sample-end-time="sampleEndTime"
        :sample-end="sampleEnd"
      />
    </div>

    <WaveformTimeline
      ref="waveformRef"
      :file-buffer="gFileBuffer"
      :loopstart="meta.LOOPSTART"
      :looplength="meta.LOOPLENGTH"
      :loop="loop"
      :volume-val="volumeVal"
      @update:region="handleRegionUpdate"
      @audioprocess="audioprocess = $event"
      @seeking="audioprocess = $event"
      @region-update-end="syncRegionToForm"
    />

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<style>
.LoopEditor {
  width: 100%;
  margin-top: -64px;
}
</style>
