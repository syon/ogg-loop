<template>
  <div>
    <div class="controls">
      <div class="buttons">
        <button @click="load">load</button>
        <button @click="play">play</button>
        <button @click="playPause">playPause</button>
        <button @click="pause">pause</button>
        <button @click="regionPlayLoop">regionPlayLoop</button>
      </div>

      <!-- <div>{{ message }}</div> -->
      <div>
        <input
          v-model="zoomVal"
          type="range"
          min="0"
          max="10000"
          style="width: 700px;"
          @change="handleChangeZoom"
        />
        <span>{{ zoomVal }}</span>
        <button @click="changeZoom(0)">Reset Zoom</button>
      </div>
      <div>
        Volume:
        <input
          v-model="volumeVal"
          type="range"
          min="0"
          max="100"
          style="width: 500px;"
          @change="changeVolume"
        />
        <span>{{ volumeVal }}</span>
      </div>
      <div class="loopInfo">
        <div>
          <div>現在地</div>
          <div class="big">{{ currentSample }}</div>
          <div class="big">{{ currentTime }}秒</div>
        </div>
        <div>
          <div>ループ開始</div>
          <div class="big">{{ sampleStart }}</div>
        </div>
        <div>
          <div>ループ終了</div>
          <div class="big">{{ sampleEnd }}</div>
        </div>
        <div>
          <div>ループ長</div>
          <div class="big">{{ sampleEnd - sampleStart }}</div>
        </div>
      </div>
    </div>
    <div id="waveform"></div>
    <div id="waveform-minimap"></div>
  </div>
</template>

<script>
/* eslint-disable no-console */
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap'

export default {
  data() {
    return {
      zoomVal: 0,
      volumeVal: 20,
      message: '',
      wavesurfer: null,
      region: null,
    }
  },
  computed: {
    currentSample() {
      if (this.wavesurfer) {
        return this.calcSample(this.wavesurfer.getCurrentTime())
      }
      return ''
    },
    currentTime() {
      if (this.wavesurfer) {
        const crr = this.wavesurfer.getCurrentTime()
        return Math.round(crr * 100) / 100
      }
      return ''
    },
    sampleStart() {
      if (this.region) {
        const crr = this.region.start
        return Math.round(crr * 44100)
      }
      return ''
    },
    sampleEnd() {
      if (this.region) {
        const crr = this.region.end
        return Math.round(crr * 44100)
      }
      return ''
    },
  },
  methods: {
    load() {
      this.wavesurfer = WaveSurfer.create({
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
                start: 10,
                end: 30,
                loop: false, // ループは playLoop でやる
                color: 'hsla(400, 100%, 30%, 0.5)',
                customStyle: { height: '80%' },
              },
            ],
          }),
        ],
      })
      console.log('-------------------')
      console.log(this.wavesurfer)
      console.log('-------------------')
      const list = this.wavesurfer.regions.list
      const [, region] = Object.entries(list)[0]
      this.region = region

      this.wavesurfer.on('ready', () => {
        this.message = 'ready'
      })

      this.wavesurfer.load('/sample.ogg')

      this.changeVolume()

      // this.wavesurfer.on('region-click', (region) => {
      //   region.loop = false
      //   // this.wavesurfer.clearRegions()
      // })
    },
    play() {
      // this.wavesurfer.play(this.wavesurfer.getCurrentTime())
      this.wavesurfer.play()
    },
    playPause() {
      this.wavesurfer.playPause()
    },
    pause() {
      this.wavesurfer.pause()
    },
    handleChangeZoom(ev) {
      this.changeZoom(ev.target.value)
    },
    changeZoom(val) {
      this.zoomVal = val
      this.wavesurfer.zoom(Number(val))
    },
    changeVolume() {
      this.wavesurfer.setVolume(Number(this.volumeVal / 100))
    },
    regionPlayLoop() {
      this.region.playLoop()
    },
    calcSample(sec) {
      return Math.round(sec * 44100)
    },
  },
}
</script>

<style>
body {
  background: #f8f8f8;
}
.container {
  width: 1000px;
  min-height: 100vh;
  margin: auto;
  padding: 50px;
  background: #fff;
}
.controls {
  margin-bottom: 1em;
}
.buttons {
  margin-bottom: 1em;
}
region.wavesurfer-region {
  height: 80% !important;
}
.loopInfo {
  display: flex;
  margin-top: 1em;
}
.loopInfo > div {
  min-width: 150px;
}
.loopInfo .big {
  font-size: 1.5rem;
}
</style>
