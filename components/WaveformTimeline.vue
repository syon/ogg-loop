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

const emit = defineEmits([
  'audioprocess',
  'seeking',
])

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
    try {
      wavesurfer.value.destroy()
    } catch (e) {
      console.warn('Failed to destroy wavesurfer:', e)
    }
  }

  const options = {
    loopstart: appState.gLoopstart,
    looplength: appState.gLooplength,
  }
  console.log('[WaveformTimeline] loadWaveform options:', options)
  console.log('[WaveformTimeline] appState.gMetadata:', appState.gMetadata)
  wavesurfer.value = Surf.create(options)

  // Wait for initial region to be created
  wavesurfer.value.once('decode', () => {
    region.value = wavesurfer.value.initialRegion
    // Store region in appState
    appState.setRegion({
      start: region.value.start,
      end: region.value.end,
    })

    // Inject custom styles into Shadow DOM
    injectShadowStyles()

    // Set up loop playback handler using regions plugin
    setupLoopHandler()
  })

  wavesurfer.value.on('audioprocess', (sec) => {
    appState.setAudioprocess(sec)
    emit('audioprocess', sec)
  })

  wavesurfer.value.on('seeking', (sec) => {
    appState.setAudioprocess(sec)
    emit('seeking', sec)
  })

  if (fileBuffer) {
    wavesurfer.value.load(fileBuffer)
  }

  // Set initial volume
  wavesurfer.value.setVolume(Number(props.volumeVal / 100))
}

const setupLoopHandler = () => {
  if (!wavesurfer.value || !wavesurfer.value.regionsPlugin) return

  const regionsPlugin = wavesurfer.value.regionsPlugin

  regionsPlugin.on('region-in', (reg) => {
  })

  regionsPlugin.on('region-out', (reg) => {
    if (props.loop) {
      reg.play()
    }
  })

  regionsPlugin.on('region-update', (region, side) => {
    // Update store with new region values
    appState.setRegion({
      start: region.start,
      end: region.end,
    })
  })
}

const injectShadowStyles = () => {
  // Find the waveform container
  const waveformContainer = document.querySelector('#waveform')
  if (!waveformContainer) return

  // Try finding shadow DOM containers
  const canvasElements = waveformContainer.querySelectorAll('div')
  canvasElements.forEach((el) => {
    if (el.shadowRoot) {
      addStylesToShadowRoot(el.shadowRoot)
    }
  })

  // Directly target elements with part attribute using partial match (~=)
  const regionElements = waveformContainer.querySelectorAll('[part~="region"]')
  regionElements.forEach((el) => {
    el.style.height = '50%'
    el.style.zIndex = '9'
  })

  const handleElements = waveformContainer.querySelectorAll(
    '[part~="region-handle"]',
  )
  handleElements.forEach((el) => {
    el.style.backgroundColor = '#f57f17'
    el.style.width = '2px'
  })

  // Add global styles using ::part() and attribute selectors
  const styleElement = document.createElement('style')
  styleElement.textContent = `
    ::part(region) {
      height: 50% !important;
      z-index: 9 !important;
    }
    ::part(region-handle) {
      border-color: #f57f17 !important;
    }
  `
  document.head.appendChild(styleElement)
}

const addStylesToShadowRoot = (shadowRoot) => {
  const style = document.createElement('style')
  style.textContent = `
    ::part(region) {
      height: 50% !important;
      z-index: 9 !important;
    }
    ::part(region-handle) {
      border-color: #f57f17 !important;
    }
  `
  shadowRoot.appendChild(style)
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
    region.value.setOptions({ start, end })
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
