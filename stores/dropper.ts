import { defineStore } from 'pinia'

const SAMPLE_RATE = 44100

interface Region {
  start: number // seconds
  end: number // seconds
}

export const useDropperStore = defineStore('dropper', {
  state: () => ({
    file: null as File | null,
    buffer: null as string | null,
    lastLoaded: null as number | null,
    region: null as Region | null,
    audioprocess: 0, // current playback position in seconds
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
      return Math.round(state.region.start * SAMPLE_RATE)
    },
    gSampleEnd: (state) => {
      if (!state.region) return 0
      return Math.round(state.region.end * SAMPLE_RATE)
    },
    gLooplengthSample: (state) => {
      if (!state.region) return 0
      return Math.round((state.region.end - state.region.start) * SAMPLE_RATE)
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
      return Math.round(state.audioprocess * SAMPLE_RATE)
    },
    gCurrentTime: (state) => {
      return formatTime(state.audioprocess)
    },
  },

  actions: {
    async load(targetFiles: File[]) {
      if (targetFiles.length > 0) {
        this.file = targetFiles[0]
      }
      for (const f of targetFiles) {
        console.log(f)
        const dataUrl = await readAsDataURL(f)
        this.buffer = dataUrl
        this.lastLoaded = new Date().getTime()
      }
    },

    setRegion(region: Region) {
      this.region = region
    },

    updateRegionFromSamples(startSample: number, lengthSample: number) {
      this.region = {
        start: startSample / SAMPLE_RATE,
        end: (startSample + lengthSample) / SAMPLE_RATE,
      }
    },

    setAudioprocess(seconds: number) {
      this.audioprocess = seconds
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
