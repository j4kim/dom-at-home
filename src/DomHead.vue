<template>
  <img src="head.png" :style="{
    gridColumn: x, gridRow: y,
    transform: `rotate(${rotate}deg)`
  }">
</template>

<script>
export default {
  props: ["x", "y", "direction"],
  computed:{
    rotate(){
      return {
        "0,-1": 0,
        "1,0": 90,
        "0,1": 180,
        "-1,0": 270
      }[this.direction.join()]
    }
  }
}
</script>

<style scoped>
img {
  width:100%;
  image-rendering: pixelated;
  user-select: none;
}
</style>
