<template>
  <v-sheet class="pa-8">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/" class="mt-4 d-inline-block">
      Home page
    </NuxtLink>
  </v-sheet>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
})

const pageNotFound = '404 Not Found'
const otherError = 'An error occurred'

const title = computed(() =>
  props.error.statusCode === 404 ? pageNotFound : otherError
)

useHead({
  title,
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
