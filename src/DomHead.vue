<template>
  <img src="head.png" :style="{
    gridColumn: x, gridRow: y
  }">
</template>

<script>
export default {
  props: ["x", "y"]
}
</script>

<style scoped>
  img {
    width:100%;
    image-rendering: pixelated;
  }
</style>
