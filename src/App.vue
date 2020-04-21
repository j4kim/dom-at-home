<template>
  <div id="app" @click="handleClick">
    <div class="grid" :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${lines}, 1fr)`,
      maxHeight: (100 * lines / columns) + 'vw',
      width: (100 * columns / lines) + 'vh'
    }">
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
      columns: 9,
      lines: 16,
      headDirection: [0,-1],
      nextDirection: [0,-1],
      snakeParts: [
        [5,10],
        [5,11],
        [5,12],
      ],
      inGame: false,
      interval: undefined
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
    moveLeftOrRight(x){
      let moveRight = x > window.innerWidth/2
      this.nextDirection = [moveRight ? 1 : -1, 0]
    },
    moveUpOrDown(y){
      let moveDown = y > window.innerHeight/2
      this.nextDirection = [0, moveDown ? 1 : -1]
    },
    changeDirection(e){
      if (this.headDirection[0] === 0) {
        this.moveLeftOrRight(e.pageX)
      } else {
        this.moveUpOrDown(e.pageY)
      }
    },
    gameOver(){
      clearInterval(this.interval)
    },
    snakeCollision(pos){
      return this.snakeParts.some(part => {
        return part.join() === pos.join()
      })
    },
    wallCollision(pos){
      return (
        pos[0] < 1 ||
        pos[0] > this.columns ||
        pos[1] < 1 ||
        pos[1] > this.rows
      )
    },
    collision(pos){
      return this.snakeCollision(pos) || this.wallCollision(pos)
    },
    move(e){
      let headPos = this.snakeParts[0]
      let newHeadPos = [
        headPos[0] + this.nextDirection[0],
        headPos[1] + this.nextDirection[1]
      ]
      if (this.collision(newHeadPos)) {
        this.gameOver()
      } else {
        this.headDirection = this.nextDirection
        this.snakeParts.unshift(newHeadPos)
        this.snakeParts.pop()
      }
    },
    requestFullscreen(){
      this.$el.requestFullscreen()
    },
    handleClick(e){
      if (!this.inGame) {
        this.requestFullscreen()
        this.inGame = true
        this.interval = setInterval(this.move, 500)
      } else {
        this.changeDirection(e)
      }
    }
  },
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

  /* adpated from https://stackoverflow.com/a/20593342/8345160 */
  height: 100vh;
  max-width: 100vw;
  margin: auto;
  position: absolute;
  top:0;bottom:0; /* vertical center */
  left:0;right:0; /* horizontal center */

  background: lightblue;
}
</style>