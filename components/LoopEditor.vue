<template>
  <v-card class="LoopEditor pa-8">
    <drop-zone />
    <v-row>
      <v-col cols="4">
        <v-file-input
          v-model="myfile"
          name="myfile"
          accept="audio/ogg"
          show-size
          outlined
          label="OGG File"
        />
      </v-col>
      <v-col cols="4">
        <div>{{ meta }}</div>
      </v-col>
      <v-col cols="2">
        <v-btn @click="handleScanOgg">ループ情報を読み取る</v-btn>
      </v-col>
      <v-col cols="2" class="text-right">
        <form
          action="/api/write"
          method="post"
          enctype="multipart/form-data"
          @submit.prevent="handleSubmit"
        >
          <v-btn type="submit" color="primary">ダウンロード</v-btn>
        </form>
      </v-col>
    </v-row>
    <div class="controls my-2">
      <div class="buttons">
        <v-btn @click="playPause">再生・一時停止</v-btn>
        <v-btn @click="regionPlayLoop">ループ再生</v-btn>
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
    <hr />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import FileDownload from 'js-file-download'
import WaveSurfer from 'wavesurfer.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions'
import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap'
import DropZone from '@/components/DropZone'
import Ogg from '@/lib/Ogg'

export default {
  components: {
    DropZone,
  },
  data() {
    return {
      myfile: null,
      zoomVal: 0,
      volumeVal: 20,
      message: '',
      wavesurfer: null,
      region: {},
      meta: {},
    }
  },
  computed: {
    ...mapGetters({
      gFile: 'dropper/gFile',
      gFileInfo: 'dropper/gFileInfo',
      gFileBuffer: 'dropper/gFileBuffer',
    }),
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
  watch: {
    gFileBuffer() {
      this.refresh()
    },
  },
  methods: {
    refresh() {
      this.myfile = this.gFile
      this.load(this.gFileBuffer)
    },
    load(fileBuffer) {
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

      this.wavesurfer.load(fileBuffer)

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
    async handleScanOgg() {
      this.meta = await Ogg.scan(this.myfile)
      if (this.meta.LOOPSTART) {
        this.region.start = this.meta.LOOPSTART / 44100
      }
      if (this.meta.LOOPLENGTH) {
        this.region.end = (this.meta.LOOPSTART + this.meta.LOOPLENGTH) / 44100
      }
    },
    async handleSubmit() {
      const formData = new FormData()
      formData.append('myfile', this.myfile)
      formData.append('loopstart', this.sampleStart)
      formData.append('looplength', this.sampleEnd - this.sampleStart)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      }
      const url = `${location.origin}/api/write`
      const data = await this.$axios.$post(url, formData, config)
      FileDownload(data, 'MyLoop.ogg')
    },
  },
}
</script>

<style>
body {
  background: #f8f8f8;
}
.container {
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;
  background: #fff;
}
.LoopEditor {
  width: 100%;
  margin-top: -64px;
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
