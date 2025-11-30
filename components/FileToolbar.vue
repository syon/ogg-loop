<script setup>
import { computed } from 'vue'
import FileDownload from 'js-file-download'
import { useAppStateStore } from '@/stores/appState'
import Ogg from '@/lib/Ogg'

const appState = useAppStateStore()

// Local computed for file input
const localMyfile = computed({
  get: () => appState.gFile,
  set: async (value) => {
    if (value) {
      appState.clearMetadata()
      await appState.load([value])
      // Auto-scan when file is selected
      await handleScan()
    }
  },
})

// Form values are directly bound to appState
const localFormLoopStartSample = computed({
  get: () => appState.formLoopStartSample,
  set: (value) => {
    appState.setFormLoopStartSample(value)
  },
})

const localFormLoopLengthSample = computed({
  get: () => appState.formLoopLengthSample,
  set: (value) => {
    appState.setFormLoopLengthSample(value)
  },
})

const handleScan = async () => {
  const file = appState.gFile
  if (!file) return

  appState.setLoading(true)
  try {
    const meta = await Ogg.scan(file)
    appState.setMetadata(meta)
    // Reload file with metadata
    await appState.load([file])
  } catch (e) {
    console.error('[FileToolbar] Scan error:', e)
    alert('Scan Error.')
  }
  appState.setLoading(false)
}

const handleFormSubmit = async () => {
  const fileToWrite = appState.gFile
  if (!fileToWrite) {
    alert('No file selected')
    return
  }

  appState.setLoading(true)
  try {
    const data = await Ogg.write({
      myfile: fileToWrite,
      loopstart: appState.formLoopStartSample,
      looplength: appState.formLoopLengthSample,
    })
    const filename = `${appState.gFileInfo.name.replace('.ogg', '')}_(Loop).ogg`
    FileDownload(data, filename)
  } catch (e) {
    console.error('[FileToolbar] Write error:', e)
    alert('Write Error.')
  }
  appState.setLoading(false)
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
      <template v-if="!appState.gMetadataReady">
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
            <v-card-text v-for="(v, k) in appState.gMetadata" :key="k">
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
      />
      <v-btn type="submit" color="primary">Download</v-btn>
    </form>
  </div>
</template>
