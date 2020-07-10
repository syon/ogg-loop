import debug from 'debug'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap'

const dg = debug('@:Surf')

export default class Surf {
  static create(options) {
    let loopstartSec = null
    let loopendSec = null
    if (options && options.loopstart && options.looplength) {
      loopstartSec = Number(options.loopstart) / 44100
      loopendSec =
        (Number(options.loopstart) + Number(options.looplength)) / 44100
    }
    const ws = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      // audioRate: 0.5,
      height: 256,
      plugins: [
        MinimapPlugin.create({
          container: '#waveform-minimap',
          waveColor: '#777',
          progressColor: '#222',
          height: 50,
        }),
        CursorPlugin.create({
          showTime: true,
        }),
        RegionsPlugin.create({
          regions: [
            {
              start: loopstartSec || 0, // sec
              end: loopendSec || 10, // sec
              loop: false, // ループは playLoop でやる
              color: 'hsla(400, 100%, 30%, 0.5)',
              customStyle: { height: '80%' },
            },
          ],
        }),
      ],
    })
    dg(ws)
    return ws
  }
}
