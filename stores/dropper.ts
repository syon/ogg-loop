import { defineStore } from 'pinia'

export const useDropperStore = defineStore('dropper', {
  state: () => ({
    file: null as File | null,
    buffer: null as string | null,
    lastLoaded: null as number | null,
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
  },
})

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
