<script setup>
import { useAppStateStore } from '@/stores/appState'

const appState = useAppStateStore()
</script>

<template>
  <div class="loopInfo d-flex">
    <v-card flat>
      <v-card-subtitle class="pb-2">Current</v-card-subtitle>
      <v-card-text>
        <div class="big grey--text text--darken-3">
          {{ appState.gCurrentTime }}
        </div>
        <div class="pt-1 text-subtitle-1">{{ appState.gCurrentSample }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle class="pb-2">Loop start</v-card-subtitle>
      <v-card-text>
        <div class="big grey--text text--darken-3">
          {{ appState.gSampleStartTime }}
        </div>
        <div class="pt-1 text-subtitle-1">{{ appState.gSampleStart }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle class="pb-2">Loop length</v-card-subtitle>
      <v-card-text>
        <div class="big grey--text text--darken-3">
          {{ appState.gLooplengthTime }}
        </div>
        <div class="pt-1 text-subtitle-1">{{ appState.gLooplengthSample }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle class="pb-2">Loop end</v-card-subtitle>
      <v-card-text>
        <div class="big grey--text text--darken-3">
          {{ appState.gSampleEndTime }}
        </div>
        <div class="pt-1 text-subtitle-1">{{ appState.gSampleEnd }}</div>
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
