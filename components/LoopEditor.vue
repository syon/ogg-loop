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
        <v-btn @click="playPause">
          <template v-if="!isPlaying">
            <v-icon v-text="'mdi-play'" />
          </template>
          <template v-else>
            <v-icon v-text="'mdi-pause'" />
          </template>
        </v-btn>
        <v-btn @click="regionPlayLoop">
          <v-icon left>mdi-twitter-retweet</v-icon>ループ再生
        </v-btn>
      </div>

      <div>
        <v-btn @click="resetZoom()">Reset Zoom</v-btn>
      </div>
      <div></div>
      <v-row>
        <v-col>
          <v-slider
            v-model="zoomVal"
            class="align-center"
            :max="1000"
            :min="0"
            hide-details
            @change="changeZoom"
          >
            <template v-slot:append>
              <v-text-field
                v-model="zoomVal"
                class="mt-0 pt-0"
                hide-details
                single-line
                type="number"
                style="width: 60px;"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
        <v-col cols="2">
          <div>Volume:</div>
          <v-slider
            v-model="volumeVal"
            prepend-icon="mdi-volume-high"
            @change="changeVolume"
          />
        </v-col>
        <v-col>
          <div>Speed:</div>
          <v-btn-toggle v-model="speedVal" @change="changeSpeed">
            <v-btn value="0.2">0.2</v-btn>
            <v-btn value="0.5">0.5</v-btn>
            <v-btn value="1.0">1.0</v-btn>
            <v-btn value="1.5">1.5</v-btn>
            <v-btn value="2.0">2.0</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
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
    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
import FileDownload from 'js-file-download'
import DropZone from '@/components/DropZone'
import Ogg from '@/lib/Ogg'
import Surf from '@/lib/Surf'

export default {
  components: {
    DropZone,
  },
  data() {
    return {
      myfile: null,
      zoomVal: 0,
      volumeVal: 20,
      speedVal: '1.0',
      wavesurfer: null,
      region: {},
      meta: {},
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      gFile: 'dropper/gFile',
      gLastLoaded: 'dropper/gLastLoaded',
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
    isPlaying() {
      return this.wavesurfer && this.wavesurfer.isPlaying()
    },
  },
  watch: {
    gLastLoaded() {
      this.refresh()
    },
  },
  methods: {
    refresh() {
      this.myfile = this.gFile
      this.load(this.gFileBuffer)
    },
    load(fileBuffer) {
      if (this.wavesurfer) {
        this.wavesurfer.destroy()
      }
      const options = {
        loopstart: this.meta.LOOPSTART,
        looplength: this.meta.LOOPLENGTH,
      }
      this.wavesurfer = Surf.create(options)
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
    resetZoom() {
      this.zoomVal = 0
      this.wavesurfer.zoom(0)
    },
    changeZoom() {
      this.wavesurfer.zoom(Number(this.zoomVal))
    },
    changeVolume() {
      this.wavesurfer.setVolume(Number(this.volumeVal / 100))
    },
    changeSpeed() {
      this.wavesurfer.setPlaybackRate(Number(this.speedVal))
    },
    regionPlayLoop() {
      this.region.playLoop()
    },
    calcSample(sec) {
      return Math.round(sec * 44100)
    },
    async handleScanOgg() {
      this.loading = true
      try {
        this.meta = await Ogg.scan(this.myfile)
      } catch (e) {
        alert('Scan Error.')
      }
      this.refresh()
      this.loading = false
    },
    async handleSubmit() {
      this.loading = true
      const myfile = this.myfile
      const loopstart = this.sampleStart
      const looplength = this.sampleEnd - this.sampleStart
      const data = await Ogg.write({ myfile, loopstart, looplength })
      const filename = `${this.gFileInfo.name.replace('.ogg', '')}_(Loop).ogg`
      this.loading = false
      FileDownload(data, filename)
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
