<script setup>
import { useAppStateStore } from '@/stores/appState'

const appState = useAppStateStore()
</script>

<template>
  <div class="loopInfo d-flex">
    <v-card flat>
      <v-card-subtitle>Current</v-card-subtitle>
      <v-card-text class="pt-1">
        <div class="big text-grey-darken-3">
          {{ appState.gCurrentTime }}
        </div>
        <div class="text-subtitle-1 text-grey-darken-1">{{ appState.gCurrentSample }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle>Loop start</v-card-subtitle>
      <v-card-text class="pt-1">
        <div class="big text-grey-darken-3">
          {{ appState.gSampleStartTime }}
        </div>
        <div class="text-subtitle-1 text-grey-darken-1">{{ appState.gSampleStart }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle>Loop length</v-card-subtitle>
      <v-card-text class="pt-1">
        <div class="big text-grey-darken-3">
          {{ appState.gLooplengthTime }}
        </div>
        <div class="text-subtitle-1 text-grey-darken-1">{{ appState.gLooplengthSample }}</div>
      </v-card-text>
    </v-card>
    <v-card flat>
      <v-card-subtitle>Loop end</v-card-subtitle>
      <v-card-text class="pt-1">
        <div class="big text-grey-darken-3">
          {{ appState.gSampleEndTime }}
        </div>
        <div class="text-subtitle-1 text-grey-darken-1">{{ appState.gSampleEnd }}</div>
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
