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
          label="Ogg File"
          hide-details
          style="width: 400px;"
          class="mr-4"
        />
        <template v-if="!metaReady">
          <v-btn depressed @click="handleScanOgg">
            <v-icon left>mdi-spotlight-beam</v-icon>
            Scan
          </v-btn>
        </template>
        <template v-else>
          <v-menu :close-on-content-click="false" min-width="250">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-bind="attrs" v-on="on">
                <v-icon left>mdi-details</v-icon>
                Meta
              </v-btn>
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
        class="d-flex align-center"
        @submit.prevent="handleSubmit"
      >
        <v-text-field
          v-model="formLoopStartSample"
          type="number"
          label="LOOPSTART"
          outlined
          hide-details
          dense
          class="mr-4"
          style="width: 140px;"
          @change="syncFormToRegion"
        />
        <v-text-field
          v-model="formLoopLengthSample"
          type="number"
          label="LOOPLENGTH"
          outlined
          hide-details
          dense
          class="mr-4"
          style="width: 140px;"
          @change="syncFormToRegion"
        />
        <v-btn type="submit" color="primary">Download</v-btn>
      </form>
    </div>
    <v-divider class="my-6" />

    <div class="controls my-2">
      <div class="d-flex justify-space-around">
        <div class="xx-nostate">
          <v-btn-toggle>
            <cmd-btn :shortkey="['i']" @do="changeZoom('')">
              <v-icon>mdi-magnify</v-icon>
              <template #tooltip>I</template>
            </cmd-btn>
            <cmd-btn :shortkey="['o']" @do="changeZoom('minus')">
              <v-icon>mdi-minus</v-icon>
              <template #tooltip>O</template>
            </cmd-btn>
            <cmd-btn :shortkey="['p']" @do="changeZoom('plus')">
              <v-icon>mdi-plus</v-icon>
              <template #tooltip>P</template>
            </cmd-btn>
          </v-btn-toggle>
        </div>
        <div>
          <v-icon left>mdi-fast-forward</v-icon>
          <v-btn-toggle v-model="speedVal" mandatory>
            <cmd-btn :shortkey="['g']" :value="0.2" @do="changeSpeed(0.2)">
              0.2
              <template #tooltip>G</template>
            </cmd-btn>
            <cmd-btn :shortkey="['h']" :value="0.5" @do="changeSpeed(0.5)">
              0.5
              <template #tooltip>H</template>
            </cmd-btn>
            <cmd-btn :shortkey="['j']" :value="1.0" @do="changeSpeed(1.0)">
              1.0
              <template #tooltip>J</template>
            </cmd-btn>
            <cmd-btn :shortkey="['k']" :value="1.5" @do="changeSpeed(1.5)">
              1.5
              <template #tooltip>K</template>
            </cmd-btn>
            <cmd-btn :shortkey="['l']" :value="2.0" @do="changeSpeed(2.0)">
              2.0
              <template #tooltip>L</template>
            </cmd-btn>
          </v-btn-toggle>
        </div>
        <div class="xx-nostate">
          <v-btn-toggle>
            <cmd-btn :shortkey="['shift', 'arrowleft']" @do="handleSkip(-10)">
              <v-icon>mdi-rewind-10</v-icon>
              <template #tooltip>
                <span>Shift + <v-icon dark small>mdi-arrow-left</v-icon></span>
              </template>
            </cmd-btn>
            <cmd-btn :shortkey="['arrowleft']" @do="handleSkip(-5)">
              <v-icon>mdi-rewind-5</v-icon>
              <template #tooltip>
                <span><v-icon dark small>mdi-arrow-left</v-icon></span>
              </template>
            </cmd-btn>
            <cmd-btn :shortkey="['arrowright']" @do="handleSkip(5)">
              <v-icon>mdi-fast-forward-5</v-icon>
              <template #tooltip>
                <span><v-icon dark small>mdi-arrow-right</v-icon></span>
              </template>
            </cmd-btn>
            <cmd-btn :shortkey="['shift', 'arrowright']" @do="handleSkip(10)">
              <v-icon>mdi-fast-forward-10</v-icon>
              <template #tooltip>
                <span>Shift + <v-icon dark small>mdi-arrow-right</v-icon></span>
              </template>
            </cmd-btn>
          </v-btn-toggle>
        </div>
        <div class="loop-controls xx-nostate">
          <v-btn-toggle>
            <cmd-btn :shortkey="['n']" @do="handleRepeat(6)">
              <v-icon class="mr-1">mdi-update</v-icon>
              <span>6</span>
              <template #tooltip>N</template>
            </cmd-btn>
            <cmd-btn :shortkey="['m']" @do="handleRepeat(3)">
              <v-icon class="mr-1">mdi-update</v-icon>
              <span>3</span>
              <template #tooltip>M</template>
            </cmd-btn>
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
    </div>

    <div class="d-flex align-center justify-center my-6">
      <div class="d-flex align-center">
        <cmd-btn :shortkey="['space']" @do="playPause">
          <template v-if="!isPlaying">
            <v-icon v-text="'mdi-play'" />
          </template>
          <template v-else>
            <v-icon v-text="'mdi-pause'" />
          </template>
          <template #tooltip>
            <span>Space</span>
          </template>
        </cmd-btn>
        <v-switch
          v-model="loop"
          class="ml-6"
          hide-details
          label="Loop"
          style="margin: 0;"
          @click="handleChangeLoop"
        />
      </div>

      <v-divider vertical class="mx-8 my-4" />

      <div class="loopInfo d-flex">
        <v-card flat>
          <v-card-subtitle class="pb-2">Current</v-card-subtitle>
          <v-card-text>
            <div class="big grey--text text--darken-3">
              {{ currentTime }}
            </div>
            <div class="pt-1 text-subtitle-1">{{ currentSample }}</div>
          </v-card-text>
        </v-card>
        <v-card flat>
          <v-card-subtitle class="pb-2">Loop start</v-card-subtitle>
          <v-card-text>
            <div class="big grey--text text--darken-3">
              {{ sampleStartTime }}
            </div>
            <div class="pt-1 text-subtitle-1">{{ sampleStart }}</div>
          </v-card-text>
        </v-card>
        <v-card flat>
          <v-card-subtitle class="pb-2">Loop length</v-card-subtitle>
          <v-card-text>
            <div class="big grey--text text--darken-3">
              {{ looplengthTime }}
            </div>
            <div class="pt-1 text-subtitle-1">{{ looplengthSample }}</div>
          </v-card-text>
        </v-card>
        <v-card flat>
          <v-card-subtitle class="pb-2">Loop end</v-card-subtitle>
          <v-card-text>
            <div class="big grey--text text--darken-3">
              {{ sampleEndTime }}
            </div>
            <div class="pt-1 text-subtitle-1">{{ sampleEnd }}</div>
          </v-card-text>
        </v-card>
      </div>
    </div>

    <div class="my-4" style="position: relative;">
      <div id="waveform-timeline"></div>
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
import CmdBtn from '@/components/CmdBtn'
import Ogg from '@/lib/Ogg'
import Surf from '@/lib/Surf'

export default {
  components: {
    DropZone,
    CmdBtn,
  },
  data() {
    return {
      myfile: null,
      audioprocess: 0,
      zoomVal: 0,
      volumeVal: 50,
      speedVal: 1.0,
      wavesurfer: null,
      region: {},
      meta: {},
      metaReady: false,
      loading: false,
      loop: true,
      formLoopStartSample: null,
      formLoopLengthSample: null,
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

      this.wavesurfer.on('seek', () => {
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
      this.wavesurfer.on('ready', () => {
        this.syncRegionToForm()
      })
      this.wavesurfer.on('region-updated', (region) => {
        this.syncRegionToForm()
      })
    },
    formatTime(v) {
      let sec = v
      if (!v) sec = 0
      return new Date(sec * 1000).toISOString().slice(14, -1)
    },
    playPause() {
      this.wavesurfer.playPause()
    },
    handleSkip(offset) {
      this.wavesurfer.skip(offset)
    },
    handleRepeat(offset) {
      const sec = this.region.end - offset
      this.wavesurfer.play(sec)
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
          this.zoomVal = 0
          this.wavesurfer.zoom(0)
          break
      }
    },
    changeVolume() {
      this.wavesurfer.setVolume(Number(this.volumeVal / 100))
    },
    changeSpeed(v) {
      this.speedVal = v
      this.wavesurfer.setPlaybackRate(Number(v))
    },
    calcSample(sec) {
      return Math.round(sec * 44100)
    },
    handleChangeLoop() {
      this.region.loop = false
    },
    syncRegionToForm() {
      this.formLoopStartSample = Math.round(this.region.start * 44100)
      this.formLoopLengthSample = Math.round(
        (this.region.end - this.region.start) * 44100
      )
    },
    syncFormToRegion() {
      const start = Number(this.formLoopStartSample) / 44100
      const end =
        (Number(this.formLoopStartSample) + Number(this.formLoopLengthSample)) /
        44100
      this.region.update({ start, end })
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
        const loopstart = this.formLoopStartSample
        const looplength = this.formLoopLengthSample
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
  height: 50% !important;
  z-index: 9 !important;
}
region .wavesurfer-handle {
  background-color: #f57f17 !important;
  width: 2px !important;
}
.loopInfo > div {
  min-width: 150px;
}
.loopInfo .big {
  font-size: 1.5rem;
}
.xx-nostate
  .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
  opacity: 0 !important;
}
</style>
