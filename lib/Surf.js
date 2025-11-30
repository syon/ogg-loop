import debug from 'debug'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap'
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline'

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

// https://wavesurfer-js.org/docs/methods.html
export default class Surf {
  static create(options) {
    let loopstartSec = null
    let loopendSec = null
    if (options && options.loopstart && options.looplength) {
      loopstartSec = samplesToSeconds(options.loopstart)
      loopendSec = calculateLoopEnd(options.loopstart, options.looplength)
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
