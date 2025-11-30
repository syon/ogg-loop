<script setup>
import { ref } from 'vue'
import CmdBtn from '@/components/CmdBtn'

const props = defineProps({
  speedVal: {
    type: Number,
    required: true,
  },
  volumeVal: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits([
  'changeZoom',
  'changeSpeed',
  'handleSkip',
  'handleRepeat',
  'update:speedVal',
  'update:volumeVal',
])

const localSpeedVal = ref(props.speedVal)
const localVolumeVal = ref(props.volumeVal)

const handleZoom = (type) => {
  emit('changeZoom', type)
}

const handleSpeed = (value) => {
  localSpeedVal.value = value
  emit('update:speedVal', value)
  emit('changeSpeed', value)
}

const handleVolumeChange = () => {
  emit('update:volumeVal', localVolumeVal.value)
}

const skip = (offset) => {
  emit('handleSkip', offset)
}

const repeat = (offset) => {
  emit('handleRepeat', offset)
}
</script>

<template>
  <div class="controls my-2">
    <div class="d-flex justify-space-around">
      <div class="xx-nostate">
        <v-btn-toggle border divided>
          <cmd-btn :shortkey="['i']" @do="handleZoom('')">
            <v-icon>mdi-magnify</v-icon>
            <template #tooltip>I</template>
          </cmd-btn>
          <cmd-btn :shortkey="['o']" @do="handleZoom('minus')">
            <v-icon>mdi-minus</v-icon>
            <template #tooltip>O</template>
          </cmd-btn>
          <cmd-btn :shortkey="['p']" @do="handleZoom('plus')">
            <v-icon>mdi-plus</v-icon>
            <template #tooltip>P</template>
          </cmd-btn>
        </v-btn-toggle>
      </div>
      <div>
        <v-icon left class="mr-2">mdi-fast-forward</v-icon>
        <v-btn-toggle v-model="localSpeedVal" mandatory border divided>
          <cmd-btn :shortkey="['g']" :value="0.2" @do="handleSpeed(0.2)">
            0.2
            <template #tooltip>G</template>
          </cmd-btn>
          <cmd-btn :shortkey="['h']" :value="0.5" @do="handleSpeed(0.5)">
            0.5
            <template #tooltip>H</template>
          </cmd-btn>
          <cmd-btn :shortkey="['j']" :value="1.0" @do="handleSpeed(1.0)">
            1.0
            <template #tooltip>J</template>
          </cmd-btn>
          <cmd-btn :shortkey="['k']" :value="1.5" @do="handleSpeed(1.5)">
            1.5
            <template #tooltip>K</template>
          </cmd-btn>
          <cmd-btn :shortkey="['l']" :value="2.0" @do="handleSpeed(2.0)">
            2.0
            <template #tooltip>L</template>
          </cmd-btn>
        </v-btn-toggle>
      </div>
      <div class="xx-nostate">
        <v-btn-toggle border divided>
          <cmd-btn :shortkey="['shift', 'arrowleft']" @do="skip(-10)">
            <v-icon>mdi-rewind-10</v-icon>
            <template #tooltip>
              <span>Shift + <v-icon dark small>mdi-arrow-left</v-icon></span>
            </template>
          </cmd-btn>
          <cmd-btn :shortkey="['arrowleft']" @do="skip(-5)">
            <v-icon>mdi-rewind-5</v-icon>
            <template #tooltip>
              <span><v-icon dark small>mdi-arrow-left</v-icon></span>
            </template>
          </cmd-btn>
          <cmd-btn :shortkey="['arrowright']" @do="skip(5)">
            <v-icon>mdi-fast-forward-5</v-icon>
            <template #tooltip>
              <span><v-icon dark small>mdi-arrow-right</v-icon></span>
            </template>
          </cmd-btn>
          <cmd-btn :shortkey="['shift', 'arrowright']" @do="skip(10)">
            <v-icon>mdi-fast-forward-10</v-icon>
            <template #tooltip>
              <span>Shift + <v-icon dark small>mdi-arrow-right</v-icon></span>
            </template>
          </cmd-btn>
        </v-btn-toggle>
      </div>
      <div class="loop-controls xx-nostate">
        <v-btn-toggle border divided>
          <cmd-btn :shortkey="['n']" @do="repeat(6)">
            <v-icon class="mr-1">mdi-update</v-icon>
            <span>6</span>
            <template #tooltip>N</template>
          </cmd-btn>
          <cmd-btn :shortkey="['m']" @do="repeat(3)">
            <v-icon class="mr-1">mdi-update</v-icon>
            <span>3</span>
            <template #tooltip>M</template>
          </cmd-btn>
        </v-btn-toggle>
      </div>
      <div class="xx-volume d-flex align-center" style="width: 150px">
        <v-slider
          v-model="localVolumeVal"
          prepend-icon="mdi-volume-high"
          thumb-label
          hide-details
          color="primary"
          @change="handleVolumeChange"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.controls {
  margin-bottom: 1em;
}
.xx-nostate :deep(.v-btn__overlay) {
  opacity: 0 !important;
}
</style>
