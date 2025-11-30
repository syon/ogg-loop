import debug from 'debug'

const dg = debug('@:lib/Ogg')

export default class Ogg {
  static async scan(myfile) {
    const formData = new FormData()
    formData.append('myfile', myfile)
    const url = `${location.origin}/api/read`
    const res = await $fetch(url, {
      method: 'POST',
      body: formData,
    })
    return Ogg.extractInfo(res)
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
    const url = `${location.origin}/api/write`
    const blob = await $fetch(url, {
      method: 'POST',
      body: formData,
      responseType: 'blob',
    })
    Ogg.sendUsage(myfile)
    return blob
  }

  static sendUsage(myfile) {
    const config = useRuntimeConfig()
    const data = {
      embeds: [
        {
          title: myfile.name,
        },
      ],
    }
    $fetch(config.public.discordWebhook, {
      method: 'POST',
      body: data,
    }).catch(() => {
      // Ignore errors from analytics
    })
  }
}
