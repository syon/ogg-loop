<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-shortkey="shortkey"
        v-bind="attrs"
        v-on="on"
        @shortkey="handleCommand(10)"
        @click="handleCommand(10)"
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
  },
  methods: {
    handleCommand() {
      this.$emit('do')
    },
  },
}
</script>
