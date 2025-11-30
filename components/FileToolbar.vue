<script setup>
import { computed } from 'vue'

const props = defineProps({
  myfile: {
    type: [File, null],
    default: null,
  },
  metaReady: {
    type: Boolean,
    required: true,
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
  formLoopStartSample: {
    type: [Number, null],
    default: null,
  },
  formLoopLengthSample: {
    type: [Number, null],
    default: null,
  },
})

const emit = defineEmits([
  'update:myfile',
  'update:formLoopStartSample',
  'update:formLoopLengthSample',
  'handleScanOgg',
  'handleSubmit',
  'syncFormToRegion',
])

const localMyfile = computed({
  get: () => props.myfile,
  set: (value) => emit('update:myfile', value),
})

const localFormLoopStartSample = computed({
  get: () => props.formLoopStartSample,
  set: (value) => emit('update:formLoopStartSample', value),
})

const localFormLoopLengthSample = computed({
  get: () => props.formLoopLengthSample,
  set: (value) => emit('update:formLoopLengthSample', value),
})

const handleScan = () => {
  emit('handleScanOgg')
}

const handleFormSubmit = () => {
  emit('handleSubmit')
}

const handleFormChange = () => {
  emit('syncFormToRegion')
}
</script>

<template>
  <div class="d-flex align-center justify-space-between">
    <div class="d-flex align-center">
      <v-file-input
        v-model="localMyfile"
        name="myfile"
        accept="audio/ogg"
        show-size
        variant="outlined"
        label="Ogg File"
        hide-details
        style="width: 400px"
        class="mr-4"
      />
      <template v-if="!metaReady">
        <v-btn variant="flat" type="button" @click="handleScan">
          <v-icon start>mdi-spotlight-beam</v-icon>
          Scan
        </v-btn>
      </template>
      <template v-else>
        <v-menu :close-on-content-click="false" min-width="250">
          <template #activator="{ props: menuProps }">
            <v-btn v-bind="menuProps">
              <v-icon start>mdi-details</v-icon>
              Meta
            </v-btn>
          </template>
          <v-card>
            <v-card-text v-for="(v, k) in meta" :key="k">
              <div class="text-caption">{{ k }}</div>
              <div class="text-body-1 text-grey-darken-4">{{ v }}</div>
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
      @submit.prevent="handleFormSubmit"
    >
      <v-text-field
        v-model.number="localFormLoopStartSample"
        type="number"
        label="LOOPSTART"
        variant="outlined"
        hide-details
        density="compact"
        class="mr-4"
        style="width: 140px"
        @update:modelValue="handleFormChange"
      />
      <v-text-field
        v-model.number="localFormLoopLengthSample"
        type="number"
        label="LOOPLENGTH"
        variant="outlined"
        hide-details
        density="compact"
        class="mr-4"
        style="width: 140px"
        @update:modelValue="handleFormChange"
      />
      <v-btn type="submit" color="primary">Download</v-btn>
    </form>
  </div>
</template>
