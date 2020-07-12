import debug from 'debug'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap'
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'

const dg = debug('@:Surf')

// https://wavesurfer-js.org/docs/methods.html
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
      waveColor: '#4DD0E1',
      progressColor: '#0097A7',
      height: 256,
      plugins: [
        MinimapPlugin.create({
          container: '#waveform-minimap',
          waveColor: '#E0E0E0',
          progressColor: '#9E9E9E',
          height: 50,
        }),
        CursorPlugin.create({
          showTime: true,
          opacity: 0.5,
        }),
        TimelinePlugin.create({
          container: '#waveform-timeline',
          primaryColor: '#212121',
          secondaryColor: '#9E9E9E',
          primaryFontColor: '#212121',
          secondaryFontColor: '#9E9E9E',
        }),
        RegionsPlugin.create({
          regions: [
            {
              start: loopstartSec || 0, // sec
              end: loopendSec || 10, // sec
              loop: false,
              color: 'hsla(65, 100%, 63%, 0.3)',
            },
          ],
        }),
      ],
    })
    dg(ws)
    return ws
  }
}
