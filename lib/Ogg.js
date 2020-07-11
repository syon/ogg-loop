import debug from 'debug'
import axios from 'axios'

const dg = debug('@:lib/Ogg')

export default class Ogg {
  static async scan(myfile) {
    const formData = new FormData()
    formData.append('myfile', myfile)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }
    const url = `${location.origin}/api/read`
    const res = await axios.post(url, formData, config)
    return Ogg.extractInfo(res.data)
  }

  static extractInfo(data) {
    if (!data) return {}
    const stripped = Object.entries(data).map(([k, v]) => {
      const key = k.toUpperCase()
      if (Array.isArray(v) && v.length > 0) {
        let val = v[0]
        if (key === 'LOOPSTART' || key === 'LOOPLENGTH') {
          val = Number(val)
        }
        return [key, val]
      }
      return [key, v]
    })
    const info = Object.fromEntries(stripped)
    dg(info)
    return info
  }

  static async write({ myfile, loopstart, looplength }) {
    const formData = new FormData()
    formData.append('myfile', myfile)
    formData.append('loopstart', loopstart)
    formData.append('looplength', looplength)
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
      responseType: 'blob',
    }
    const url = `${location.origin}/api/write`
    const res = await axios.post(url, formData, config)
    return res.data
  }
}
