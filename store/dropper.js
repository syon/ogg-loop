export const state = () => ({
  file: null,
  buffer: null,
})

export const getters = {
  gFile(state) {
    return state.file
  },
  gFileBuffer(state) {
    return state.buffer
  },
  gFileInfo(state) {
    const { name, size, type, lastModified, lastModifiedDate } = state.file
    return { name, size, type, lastModified, lastModifiedDate }
  },
}

export const mutations = {
  SET_File(state, file) {
    state.file = file
  },
  SET_Buffer(state, buffer) {
    state.buffer = buffer
  },
}

export const actions = {
  async load({ commit }, targetFiles) {
    if (targetFiles.length > 0) {
      commit('SET_File', targetFiles[0])
    }
    for (const f of targetFiles) {
      console.log(f)
      const ab = await readAsArrayBuffer(f)
      commit('SET_Buffer', ab)
    }
  },
}

// eslint-disable-next-line no-unused-vars
function fetchFiles(event) {
  const files = event.target.files
    ? event.target.files
    : event.dataTransfer.files
  return files
}

function readAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    console.log('[#readAsArrayBuffer] start')
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log('[#readAsArrayBuffer] end')
      resolve(reader.result)
    }
  })
}

// eslint-disable-next-line no-unused-vars
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
  })
}
