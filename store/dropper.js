export const state = () => ({
  show: false,
  files: [],
})

export const getters = {
  gShow(state) {
    return state.show
  },
  gFiles(state) {
    return state.files
  },
}

export const mutations = {
  SET_SHOW(state, bool) {
    state.show = bool
  },
  SET_Files(state, files) {
    state.files = files
  },
}

export const actions = {
  dragover({ state, commit }) {
    console.log('[#dragover]')
    if (!state.show) {
      commit('SET_SHOW', true)
    }
  },
  dragleave({ state, commit }) {
    console.log('[#dragleave]')
    if (state.show) {
      commit('SET_SHOW', false)
    }
  },
  async load({ commit }, onDropEvent) {
    const targetFiles = fetchFiles(onDropEvent)
    const files = []
    for (const f of targetFiles) {
      console.log(f)
      const { name, size, type, lastModified, lastModifiedDate } = f
      const u = await readFileAsDataURL(f)
      files.push({
        name,
        size,
        type,
        lastModified,
        lastModifiedDate,
        dataURL: u,
      })
    }
    commit('SET_Files', files)
  },
}

function fetchFiles(event) {
  const files = event.target.files
    ? event.target.files
    : event.dataTransfer.files
  return files
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      resolve(reader.result)
    }
  })
}
