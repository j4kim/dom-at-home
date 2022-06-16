<template>
  <svg class="volume-icon" viewBox="0 0 24 24" @click="$store.dispatch('changeVolume')">
    <path fill="white" :d="d" />
  </svg>
</template>

<script>
export default {
  data: () => ({
    pathData: {
      "volume-1"  : "M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z",
      "volume-0.3": "M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z",
      "volume-0"  : "M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"
    }
  }),
  computed: {
    volume () {
      return this.$store.state.volume
    },
    d () {
      return this.pathData[`volume-${this.volume}`]
    }
  }
}
</script>

<style>
.volume-icon {
  width: 30%;
  cursor: pointer;
}
</style>