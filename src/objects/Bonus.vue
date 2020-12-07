<template>
  <img :src="src" :style="{
    gridColumn: pos[0], gridRow: pos[1]
  }">
</template>

<script>
import cervelas from "@/assets/cervelas.png"
import ricard from "@/assets/ricard.png"

export default {
  props: ["pos", "asset"],
  computed: {
    src() {
      return { cervelas, ricard }[this.asset]
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
