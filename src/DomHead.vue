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
        "-1,0": 0,
        "0,1": 90,
        "1,0": 180,
        "0,-1": 270
      }[this.direction.join()]
    }
  }
}
</script>

<style scoped>
  img {
    width:100%;
    image-rendering: pixelated;
  }
</style>
