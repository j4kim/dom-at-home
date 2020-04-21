<template>
  <div id="app" @click="$el.requestFullscreen()">
    <div class="grid">
      <component
        v-for="o in sceneObjects"
        :is="o.component"
        :key="o.id"
        :x="o.x" :y="o.y"
        :direction="o.direction"
      >
      </component>
    </div>
  </div>
</template>

<script>
import DomHead from "@/DomHead"
import DomBeard from "@/DomBeard"
export default {
  components: { DomHead, DomBeard },
  data(){
    return {
      headDirection: [0,-1],
      snakeParts: [
        [5,10],
        [5,11],
        [5,12],
      ]
    }
  },
  computed: {
    sceneObjects(){
      let objects = []
      this.snakeParts.forEach((part, i) => {
        objects.push({
          x: part[0],
          y: part[1],
          component: i === 0 ? "dom-head" : "dom-beard",
          direction: this.headDirection,
          id: i
        })
      })
      return objects
    }
  }
}
</script>

<style>
html,body{
  padding:0;
  margin:0;
}
.grid{
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(16, 1fr);

  /* adpated from https://stackoverflow.com/a/20593342/8345160 */
  height: 100vh;
  max-height: 177.78vw; /* 16/9 = 1.778 */
  width: 56.25vh; /* 9/16 = .5625  */
  max-width: 100vw;
  margin: auto;
  position: absolute;
  top:0;bottom:0; /* vertical center */
  left:0;right:0; /* horizontal center */

  background: lightblue;
}
</style>