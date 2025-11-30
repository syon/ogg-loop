<template>
  <v-tooltip location="bottom">
    <template #activator="{ props }">
      <v-btn
        v-shortkey="shortkey"
        :value="$attrs.value"
        :icon="icon"
        v-bind="props"
        @shortkey="handleCommand"
        @click="handleCommand"
      >
        <slot />
      </v-btn>
    </template>
    <slot name="tooltip" />
  </v-tooltip>
</template>

<script>
export default {
  props: {
    shortkey: { type: Array, default: () => [] },
    icon: { type: Boolean, default: false },
  },
  methods: {
    handleCommand() {
      console.log('[#handleCommand]')
      this.$emit('do')
    },
  },
}
</script>
