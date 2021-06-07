<template>
  <div class="dom-head" :style="{
    gridColumn: pos[0], gridRow: pos[1],
  }">
    <img class="head" :src="src" :style="{
      transform: `rotate(${rotate}deg)`,
    }">
    <img
      v-if="vomit"
      class="vomit"
      src="@/assets/vomit.gif"
      :style="vomitStyle"
    >
  </div>
</template>

<script>
import head from "@/assets/head.png"
import crashedHead1 from "@/assets/head-crash.png"
import crashedHead2 from "@/assets/head-crash-openmouth.png"

export default {
  props: ["pos", "nextDir"],
  computed:{
    rotate(){
      return {
        "0,-1": 0,
        "1,0": 90,
        "0,1": 180,
        "-1,0": 270
      }[this.nextDir.join()]
    },
    crashedHead() {
      return this.vomit ? crashedHead2 : crashedHead1
    },
    src(){
      return this.crashed ? this.crashedHead : head
    },
    crashed(){
      return this.$store.state.over
    },
    vomit(){
      return this.$store.state.vomit
    },
    strHeadDir(){
      return this.$store.state.snake.head.dir.join()
    },
    vomitStyle(){
      return {
        "0,-1": { left: '15%', top: '70%' },
        "1,0": { left: '0%', top: '60%' },
        "0,1": { left: '15%', top: '35%' },
        "-1,0": { left: '30%', top: '60%' }
      }[this.strHeadDir]
    }
  }
}
</script>

<style lang="scss">
div.dom-head {
  background-color: #2a1e1b;
  position: relative;
  img {
    image-rendering: pixelated;
    user-select: none;
    display: block;
  }
  img.head {
    width: 100%;
  }
  img.vomit {
    width: 62.5%;
    position: absolute;
  }
}
</style>
