<template>
  <v-card class="LoopEditor pa-8" min-height="85vh">
    <drop-zone />
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex align-center">
        <v-file-input
          v-model="myfile"
          name="myfile"
          accept="audio/ogg"
          show-size
          outlined
          label="OGG File"
          hide-details
          style="width: 400px;"
          class="mr-4"
        />
        <template v-if="!metaReady">
          <v-btn depressed @click="handleScanOgg">ループ情報を読み取る</v-btn>
        </template>
        <template v-else>
          <v-menu :close-on-content-click="false" min-width="250">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">メタデータ</v-btn>
            </template>
            <v-card>
              <v-card-text v-for="(v, k) in meta" :key="k">
                <div class="text-caption">{{ k }}</div>
                <div class="text-body-1 grey--text text--darken-4">{{ v }}</div>
              </v-card-text>
            </v-card>
          </v-menu>
        </template>
      </div>
      <form
        action="/api/write"
        method="post"
        enctype="multipart/form-data"
        @submit.prevent="handleSubmit"
      >
        <v-btn type="submit" color="primary">ダウンロード</v-btn>
      </form>
    </div>
    <v-divider class="my-8" />
    <div class="controls my-2">
      <div class="d-flex justify-space-between">
        <div class="d-flex align-center">
          <v-btn
            v-shortkey="['space']"
            class="mr-6"
            @shortkey="playPause"
            @click="playPause"
          >
            <template v-if="!isPlaying">
              <v-icon v-text="'mdi-play'" />
            </template>
            <template v-else>
              <v-icon v-text="'mdi-pause'" />
            </template>
          </v-btn>
          <v-switch
            v-model="loop"
            hide-details
            label="ループ"
            style="margin: 0;"
            @click="handleChangeLoop"
          />
        </div>
        <div>
          <v-btn-toggle>
            <v-btn @click="handleSkip(-5)">
              <v-icon>mdi-rewind-5</v-icon>
            </v-btn>
            <v-btn @click="handleSkip(5)">
              <v-icon>mdi-fast-forward-5</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div>
          <v-icon left>mdi-fast-forward</v-icon>
          <v-btn-toggle v-model="speedVal" mandatory @change="changeSpeed">
            <v-btn value="0.2">0.2</v-btn>
            <v-btn value="0.5">0.5</v-btn>
            <v-btn value="1.0">1.0</v-btn>
            <v-btn value="1.5">1.5</v-btn>
            <v-btn value="2.0">2.0</v-btn>
          </v-btn-toggle>
        </div>
        <div>
          <v-btn-toggle>
            <v-btn @change="changeZoom('minus')">
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <v-btn @change="changeZoom('')">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn @change="changeZoom('plus')">
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-btn-toggle>
        </div>
        <div class="xx-volume d-flex align-center" style="width: 150px;">
          <v-slider
            v-model="volumeVal"
            prepend-icon="mdi-volume-high"
            hide-details
            @change="changeVolume"
          />
        </div>
      </div>
      <div class="loopInfo">
        <div>
          <div>現在</div>
          <div class="big">{{ currentTime }}</div>
          <div class="text-subtitle-1">{{ currentSample }}</div>
        </div>
        <div>
          <div>ループ開始</div>
          <div class="big">{{ sampleStartTime }}</div>
          <div class="text-subtitle-1">{{ sampleStart }}</div>
        </div>
        <div>
          <div>ループ終了</div>
          <div class="big">{{ sampleEndTime }}</div>
          <div class="text-subtitle-1">{{ sampleEnd }}</div>
        </div>
        <div>
          <div>ループ長</div>
          <div class="big">{{ looplengthTime }}</div>
          <div class="text-subtitle-1">{{ looplengthSample }}</div>
        </div>
      </div>
    </div>
    <div class="my-4" style="position: relative;">
      <div id="waveform"></div>
      <div id="waveform-minimap"></div>
    </div>
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
      audioprocess: 0,
      zoomVal: 0,
      volumeVal: 20,
      speedVal: '1.0',
      wavesurfer: null,
      region: {},
      meta: {},
      metaReady: false,
      loading: false,
      loop: true,
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
      return Math.round(this.audioprocess * 44100)
    },
    currentTime() {
      return this.formatTime(this.audioprocess)
    },
    sampleStart() {
      if (this.region) {
        const crr = this.region.start
        return Math.round(crr * 44100)
      }
      return ''
    },
    sampleStartTime() {
      if (this.region) {
        return this.formatTime(this.region.start)
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
    sampleEndTime() {
      if (this.region) {
        return this.formatTime(this.region.end)
      }
      return ''
    },
    looplengthSample() {
      return this.sampleEnd - this.sampleStart
    },
    looplengthTime() {
      return this.formatTime(this.looplengthSample / 44100)
    },
    isPlaying() {
      return this.wavesurfer && this.wavesurfer.isPlaying()
    },
  },
  watch: {
    gLastLoaded() {
      this.metaReady = false
      this.refresh()
    },
  },
  async mounted() {
    await this.applySampleAudio()
  },
  methods: {
    async applySampleAudio() {
      const url = `${location.origin}/TropicalBeach.ogg`
      const m = await this.$axios.$get(url, { responseType: 'blob' })
      m.name = 'TropicalBeach.ogg'
      this.$store.dispatch('dropper/load', [m])
      this.meta = { LOOPSTART: 5487730, LOOPLENGTH: 3080921 }
    },
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

      this.wavesurfer.on('audioprocess', (sec) => {
        this.audioprocess = sec
      })

      this.wavesurfer.on('seek', (a, b) => {
        const sec = this.wavesurfer.getCurrentTime()
        this.audioprocess = sec
        if (sec < region.start || region.end < sec) {
          region.loop = false
        }
      })

      if (fileBuffer) {
        this.wavesurfer.load(fileBuffer)
      }

      this.changeVolume()

      this.wavesurfer.on('region-in', (region) => {
        if (this.loop) {
          region.loop = true
        }
      })
      this.wavesurfer.on('region-out', (region) => {
        region.loop = false
      })
    },
    formatTime(v) {
      let sec = v
      if (!v) sec = 0
      return new Date(sec * 1000).toISOString().slice(14, -1)
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
    handleSkip(offset) {
      this.wavesurfer.skip(offset)
    },
    resetZoom() {
      this.zoomVal = 0
      this.wavesurfer.zoom(0)
    },
    changeZoom(sub) {
      switch (sub) {
        case 'minus':
          this.zoomVal = this.zoomVal <= 20 ? 0 : this.zoomVal - 20
          this.wavesurfer.zoom(Number(this.zoomVal))
          break
        case 'plus':
          this.zoomVal += 20
          this.wavesurfer.zoom(Number(this.zoomVal))
          break
        default:
          this.wavesurfer.zoom(0)
          break
      }
    },
    changeVolume() {
      this.wavesurfer.setVolume(Number(this.volumeVal / 100))
    },
    changeSpeed() {
      this.wavesurfer.setPlaybackRate(Number(this.speedVal))
    },
    calcSample(sec) {
      return Math.round(sec * 44100)
    },
    handleChangeLoop() {
      this.region.loop = false
    },
    async handleScanOgg() {
      this.loading = true
      try {
        this.meta = await Ogg.scan(this.myfile)
      } catch (e) {
        alert('Scan Error.')
      }
      this.refresh()
      this.metaReady = true
      this.loading = false
    },
    async handleSubmit() {
      this.loading = true
      try {
        const myfile = this.myfile
        const loopstart = this.sampleStart
        const looplength = this.sampleEnd - this.sampleStart
        const data = await Ogg.write({ myfile, loopstart, looplength })
        const filename = `${this.gFileInfo.name.replace('.ogg', '')}_(Loop).ogg`
        FileDownload(data, filename)
      } catch (e) {
        alert('Write Error.')
      }
      this.loading = false
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
  /* z-index: 0 !important; */
}
region .wavesurfer-handle {
  background-color: #f57f17 !important;
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
