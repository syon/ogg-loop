<script setup>
import { computed } from 'vue'
import { useAppStateStore } from '@/stores/appState'

const appState = useAppStateStore()

// Get all values from store
const currentTime = computed(() => appState.gCurrentTime)
const currentSample = computed(() => appState.gCurrentSample)
const sampleStartTime = computed(() => appState.gSampleStartTime)
const sampleStart = computed(() => appState.gSampleStart)
const looplengthTime = computed(() => appState.gLooplengthTime)
const looplengthSample = computed(() => appState.gLooplengthSample)
const sampleEndTime = computed(() => appState.gSampleEndTime)
const sampleEnd = computed(() => appState.gSampleEnd)
</script>

<template>
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
</template>

<style scoped>
.loopInfo > div {
  min-width: 150px;
}
.loopInfo .big {
  font-size: 1.5rem;
}
</style>
