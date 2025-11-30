import { defineStore } from 'pinia'
import { samplesToSeconds, secondsToSamples } from '@/lib/Surf'

interface Region {
  start: number // seconds
  end: number // seconds
}

export const useAppStateStore = defineStore('appState', {
  state: () => ({
    file: null as File | null,
    buffer: null as string | null,
    lastLoaded: null as number | null,
    region: null as Region | null,
    audioprocess: 0, // current playback position in seconds
    formLoopStartSample: null as number | null,
    formLoopLengthSample: null as number | null,
    zoom: 0, // zoom level for waveform
    metadata: null as Record<string, any> | null, // OGG file metadata
    volume: 50, // volume level (0-100)
    speed: 1.0, // playback speed
    loopEnabled: true, // loop playback enabled
    loading: false, // loading state for async operations
  }),

  getters: {
    gFile: (state) => state.file,
    gLastLoaded: (state) => state.lastLoaded,
    gFileBuffer: (state) => state.buffer,
    gFileInfo: (state) => {
      if (!state.file) return {}
      const { name, size, type, lastModified } = state.file
      return { name, size, type, lastModified }
    },
    gRegion: (state) => state.region,
    gAudioprocess: (state) => state.audioprocess,

    // Loop region computed values
    gSampleStart: (state) => {
      if (!state.region) return 0
      return secondsToSamples(state.region.start)
    },
    gSampleEnd: (state) => {
      if (!state.region) return 0
      return secondsToSamples(state.region.end)
    },
    gLooplengthSample: (state) => {
      if (!state.region) return 0
      return secondsToSamples(state.region.end - state.region.start)
    },
    // Form values converted to seconds for waveform
    gFormLoopStartSeconds: (state) => {
      if (!state.formLoopStartSample) return 0
      return samplesToSeconds(state.formLoopStartSample)
    },
    gFormLoopEndSeconds: (state) => {
      if (!state.formLoopStartSample || !state.formLoopLengthSample) return 0
      return samplesToSeconds(state.formLoopStartSample + state.formLoopLengthSample)
    },
    gSampleStartTime: (state) => {
      if (!state.region) return '00:00.000'
      return formatTime(state.region.start)
    },
    gSampleEndTime: (state) => {
      if (!state.region) return '00:00.000'
      return formatTime(state.region.end)
    },
    gLooplengthTime: (state) => {
      if (!state.region) return '00:00.000'
      return formatTime(state.region.end - state.region.start)
    },
    gCurrentSample: (state) => {
      return secondsToSamples(state.audioprocess)
    },
    gCurrentTime: (state) => {
      return formatTime(state.audioprocess)
    },
    gZoom: (state) => state.zoom,
    gMetadata: (state) => state.metadata,
    gMetadataReady: (state) => state.metadata !== null,
    gLoopstart: (state) => state.metadata?.LOOPSTART || null,
    gLooplength: (state) => state.metadata?.LOOPLENGTH || null,
    gVolume: (state) => state.volume,
    gSpeed: (state) => state.speed,
    gVolumeNormalized: (state) => state.volume / 100, // 0-1 for WaveSurfer
    gLoopEnabled: (state) => state.loopEnabled,
    gLoading: (state) => state.loading,
  },

  actions: {
    async load(targetFiles: File[], preserveMetadata = false) {
      if (targetFiles.length > 0) {
        this.file = targetFiles[0]
      }
      // Store current metadata if preservation is requested
      const savedMetadata = preserveMetadata ? this.metadata : null
      for (const f of targetFiles) {
        console.log(f)
        const dataUrl = await readAsDataURL(f)
        this.buffer = dataUrl
        this.lastLoaded = new Date().getTime()
      }
      // Restore metadata if it was preserved
      if (savedMetadata) {
        this.metadata = savedMetadata
      }
    },

    setRegion(region: Region) {
      this.region = region
      // Sync form values when region changes
      this.formLoopStartSample = secondsToSamples(region.start)
      this.formLoopLengthSample = secondsToSamples(region.end - region.start)
    },

    updateRegionByForm(startSample: number, lengthSample: number) {
      const start = samplesToSeconds(startSample)
      const end = samplesToSeconds(startSample + lengthSample)
      this.region = { start, end }
      // Update form values
      this.formLoopStartSample = startSample
      this.formLoopLengthSample = lengthSample
    },

    syncFormToRegion() {
      if (!this.formLoopStartSample || !this.formLoopLengthSample) return
      this.updateRegionByForm(this.formLoopStartSample, this.formLoopLengthSample)
    },

    setFormLoopStartSample(value: number) {
      this.formLoopStartSample = value
    },

    setFormLoopLengthSample(value: number) {
      this.formLoopLengthSample = value
    },

    setAudioprocess(seconds: number) {
      this.audioprocess = seconds
    },

    changeZoom(operation: 'reset' | 'minus' | 'plus') {
      switch (operation) {
        case 'minus':
          this.zoom = this.zoom <= 20 ? 0 : this.zoom - 20
          break
        case 'plus':
          this.zoom += 20
          break
        default:
          this.zoom = 0
          break
      }
    },

    setMetadata(meta: Record<string, any>) {
      this.metadata = meta
      console.log('Metadata arg:', meta)
      console.log('Metadata set:', this.metadata)

      // Auto-populate form values from metadata
      if (meta.LOOPSTART !== undefined) {
        this.formLoopStartSample = meta.LOOPSTART
      }
      if (meta.LOOPLENGTH !== undefined) {
        this.formLoopLengthSample = meta.LOOPLENGTH
      }
    },

    clearMetadata() {
      this.metadata = null
      // Clear form values as well
      this.formLoopStartSample = null
      this.formLoopLengthSample = null
    },

    setVolume(value: number) {
      this.volume = value
    },

    setSpeed(value: number) {
      this.speed = value
    },

    toggleLoop() {
      this.loopEnabled = !this.loopEnabled
    },

    setLoop(value: boolean) {
      this.loopEnabled = value
    },

    setLoading(value: boolean) {
      this.loading = value
    },
  },
})

function formatTime(seconds: number): string {
  if (!seconds) seconds = 0
  return new Date(seconds * 1000).toISOString().slice(14, -1)
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = reject
  })
}
