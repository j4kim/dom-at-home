<template>
  <img id="dom-head" :src="src" :style="{
    gridColumn: x, gridRow: y,
    transform: `rotate(${rotate}deg)`
  }">
</template>

<script>
import head from "@/assets/head.png"
import crashedHead from "@/assets/head-crash.png"

export default {
  props: ["x", "y", "direction", "crashed"],
  computed:{
    rotate(){
      return {
        "0,-1": 0,
        "1,0": 90,
        "0,1": 180,
        "-1,0": 270
      }[this.direction.join()]
    },
    src(){
      return this.crashed ? crashedHead : head
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
