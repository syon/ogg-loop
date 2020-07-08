export const state = () => ({
  files: [],
})

export const getters = {
  gFiles(state) {
    return state.files
  },
}

export const mutations = {
  SET_Files(state, files) {
    state.files = files
  },
}

export const actions = {
  async load({ commit }, targetFiles) {
    const files = []
    for (const f of targetFiles) {
      console.log(f)
      const { name, size, type, lastModified, lastModifiedDate } = f
      const ab = await readAsArrayBuffer(f)
      files.push({
        name,
        size,
        type,
        lastModified,
        lastModifiedDate,
        data: ab,
      })
    }
    commit('SET_Files', files)
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
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
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
