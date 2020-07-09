export const state = () => ({
  info: {
    DATE: '',
    LOOPLENGTH: '',
    LOOPSTART: '',
    SOFTWARE: '',
  },
})

export const getters = {
  gAudioInfo(state) {
    return state.info
  },
}

export const mutations = {
  SET_AudioInfo(state, payload) {
    state.info = payload
  },
}

export const actions = {
  async scan({ commit }, myfile) {
    const formData = new FormData()
    formData.append('myfile', myfile)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    const url = `${location.origin}/api/read`
    const data = await this.$axios.$post(url, formData, config)
    commit('SET_AudioInfo', extractInfo(data))
  },
}

function extractInfo(data) {
  const stripped = Object.entries(data).map(([k, v]) => {
    if (Array.isArray(v) && v.length > 0) {
      let val = v[0]
      if (k === 'LOOPSTART' || k === 'LOOPLENGTH') {
        val = Number(val)
      }
      return [k, val]
    }
    return [k, v]
  })
  return Object.fromEntries(stripped)
}
