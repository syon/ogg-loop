import debug from 'debug'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions.esm.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugins/timeline.esm.js'
import MinimapPlugin from 'wavesurfer.js/dist/plugins/minimap.esm.js'

const dg = debug('@:Surf')

// Audio calculation constants and utilities
export const SAMPLE_RATE = 44100

// Convert samples to seconds
export function samplesToSeconds(samples) {
  return Number(samples) / SAMPLE_RATE
}

// Convert seconds to samples
export function secondsToSamples(seconds) {
  return Math.round(Number(seconds) * SAMPLE_RATE)
}

// Calculate loop end time from start sample and length sample
export function calculateLoopEnd(startSample, lengthSample) {
  return samplesToSeconds(Number(startSample) + Number(lengthSample))
}

// https://wavesurfer.xyz/docs/
export default class Surf {
  static create(options) {
    let loopstartSec = null
    let loopendSec = null
    if (options && options.loopstart && options.looplength) {
      loopstartSec = samplesToSeconds(options.loopstart)
      loopendSec = calculateLoopEnd(options.loopstart, options.looplength)
    }

    // Create regions plugin instance
    const regionsPlugin = RegionsPlugin.create()

    const ws = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#4DD0E1',
      progressColor: '#0097A7',
      height: 256,
      plugins: [
        TimelinePlugin.create({
          container: '#waveform-timeline',
        }),
        MinimapPlugin.create({
          container: '#waveform-minimap',
          waveColor: '#E0E0E0',
          progressColor: '#9E9E9E',
          height: 50,
        }),
        regionsPlugin,
      ],
    })

    // Store regions plugin reference
    ws.regionsPlugin = regionsPlugin

    // Add initial region after audio is loaded
    ws.once('decode', () => {
      ws.initialRegion = regionsPlugin.addRegion({
        start: loopstartSec || 0,
        end: loopendSec || 10,
        color: 'hsla(65, 100%, 63%, 0.3)',
        drag: true,
        resize: true,
      })
    })

    // dg(ws)
    return ws
  }
}
