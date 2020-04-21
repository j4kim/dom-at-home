<template>
  <div id="app" @click="handleClick">
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
      ],
      inGame: false
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
  },
  methods:{
    moveLeftOrRight(offsetX){
      let moveRight = offsetX > window.innerWidth/2
      this.headDirection = [moveRight ? 1 : -1, 0]
    },
    moveUpOrDown(offsetY){
      let moveDown = offsetY > window.innerHeight/2
      this.headDirection = [0, moveDown ? 1 : -1]
    },
    move(e){
      if (this.headDirection[0] === 0) {
        this.moveLeftOrRight(e.screenX)
      } else {
        this.moveUpOrDown(e.screenY)
      }
      let headPos = this.snakeParts[0]
      let newHeadPos = [
        headPos[0] + this.headDirection[0],
        headPos[1] + this.headDirection[1]
      ]
      this.snakeParts.unshift(newHeadPos)
    },
    handleClick(e){
      if (!this.inGame) {
        this.inGame = true
        this.$el.requestFullscreen()
      } else {
        this.move(e)
      }
    }
  }
}
</script>

<style>
html,body{
  padding:0;
  margin:0;
}
#app{
  width: 100vw;
  height: 100vh;
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