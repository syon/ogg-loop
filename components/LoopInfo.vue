<script setup>
import { computed } from 'vue'
import { useDropperStore } from '@/stores/dropper'

const dropperStore = useDropperStore()

// Get all values from store
const currentTime = computed(() => dropperStore.gCurrentTime)
const currentSample = computed(() => dropperStore.gCurrentSample)
const sampleStartTime = computed(() => dropperStore.gSampleStartTime)
const sampleStart = computed(() => dropperStore.gSampleStart)
const looplengthTime = computed(() => dropperStore.gLooplengthTime)
const looplengthSample = computed(() => dropperStore.gLooplengthSample)
const sampleEndTime = computed(() => dropperStore.gSampleEndTime)
const sampleEnd = computed(() => dropperStore.gSampleEnd)
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
