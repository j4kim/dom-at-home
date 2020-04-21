<template>
  <div id="app" @click="$el.requestFullscreen()">
    <div class="grid">
      <component
        v-for="part in snakeParts"
        :is="part.component"
        :key="part.id"
        :x="part.x" :y="part.y"
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
      snakeParts: [
        {
          x:5, y:10,
          component: "dom-head",
          id: 1
        },
        {
          x:5, y:11,
          component: "dom-beard",
          id: 2
        },
        {
          x:5, y:12,
          component: "dom-beard",
          id: 3
        }
      ]
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