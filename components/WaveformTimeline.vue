<script setup>
import { ref, onMounted, watch } from 'vue'
import Surf from '@/lib/Surf'
import { useAppStateStore } from '@/stores/appState'

const appState = useAppStateStore()

const props = defineProps({
  fileBuffer: {
    type: String,
    default: null,
  },
  loop: {
    type: Boolean,
    default: true,
  },
  volumeVal: {
    type: Number,
    default: 50,
  },
})

const emit = defineEmits(['audioprocess', 'seeking'])

const wavesurfer = ref(null)
const region = ref({})

// Watch for file buffer changes only
watch(
  () => props.fileBuffer,
  (newBuffer) => {
    if (newBuffer) {
      loadWaveform(newBuffer)
    }
  },
)

// Watch for volume changes
watch(
  () => props.volumeVal,
  (newVolume) => {
    if (wavesurfer.value) {
      wavesurfer.value.setVolume(Number(newVolume / 100))
    }
  },
)

const loadWaveform = (fileBuffer) => {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
  }

  const options = {
    loopstart: appState.gLoopstart,
    looplength: appState.gLooplength,
  }
  wavesurfer.value = Surf.create(options)

  // Get the initial region from regions list
  const list = wavesurfer.value.regions.list
  const [, initialRegion] = Object.entries(list)[0]
  region.value = initialRegion

  wavesurfer.value.on('audioprocess', (sec) => {
    appState.setAudioprocess(sec)
    emit('audioprocess', sec)
  })

  wavesurfer.value.on('seek', () => {
    const sec = wavesurfer.value.getCurrentTime()
    appState.setAudioprocess(sec)
    emit('seeking', sec)
    if (region.value && (sec < region.value.start || region.value.end < sec)) {
      region.value.loop = false
    }
  })

  if (fileBuffer) {
    wavesurfer.value.load(fileBuffer)
  }

  // Set initial volume
  wavesurfer.value.setVolume(Number(props.volumeVal / 100))

  wavesurfer.value.on('region-in', (reg) => {
    if (props.loop) {
      reg.loop = true
    }
  })

  wavesurfer.value.on('region-out', (reg) => {
    reg.loop = false
  })

  wavesurfer.value.on('ready', () => {
    appState.setRegion({
      start: region.value.start,
      end: region.value.end,
    })
  })

  wavesurfer.value.on('region-updated', (reg) => {
    appState.setRegion({
      start: reg.start,
      end: reg.end,
    })
  })
}

// Public methods exposed to parent
const playPause = () => {
  if (wavesurfer.value) {
    if (wavesurfer.value.isPlaying()) {
      wavesurfer.value.pause()
    } else {
      // Resume playing from current position
      wavesurfer.value.play()
    }
  }
}

const skip = (offset) => {
  if (wavesurfer.value) {
    wavesurfer.value.skip(offset)
  }
}

const play = (sec) => {
  if (wavesurfer.value) {
    wavesurfer.value.play(sec)
  }
}

const zoom = (value) => {
  if (wavesurfer.value) {
    wavesurfer.value.zoom(Number(value))
  }
}

const setPlaybackRate = (rate) => {
  if (wavesurfer.value) {
    wavesurfer.value.setPlaybackRate(Number(rate))
  }
}

const isPlaying = () => {
  return wavesurfer.value && wavesurfer.value.isPlaying()
}

const updateRegion = (start, end) => {
  if (region.value) {
    region.value.update({ start, end })
  }
}

// Expose public methods to parent
defineExpose({
  playPause,
  skip,
  play,
  zoom,
  setPlaybackRate,
  isPlaying,
  updateRegion,
})
</script>

<template>
  <div class="my-4" style="position: relative">
    <div id="waveform-timeline"></div>
    <div id="waveform"></div>
    <div id="waveform-minimap"></div>
  </div>
</template>

<style>
region.wavesurfer-region {
  height: 50% !important;
  z-index: 9 !important;
}
region .wavesurfer-handle {
  background-color: #f57f17 !important;
  width: 2px !important;
}
</style>
