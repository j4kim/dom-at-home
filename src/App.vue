<template>
  <div id="app" @click="handleClick">
    <div class="grid" ref="grid" :style="{
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gridTemplateRows: `repeat(${rows}, 1fr)`,
      maxHeight: (100 * rows / columns) + 'vw',
      width: (100 * columns / rows) + 'vh'
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
import { random } from "lodash"
import "fullscreen-api-polyfill"

import DomHead from "@/DomHead"
import DomBeard from "@/DomBeard"
import Bonus from "@/Bonus"

export default {
  components: { DomHead, DomBeard, Bonus },
  data(){
    return {
      columns: 9,
      rows: 16,
      headDirection: [0,-1],
      nextDirection: [0,-1],
      snakeParts: [
        [5,10],
        [5,11],
        [5,12],
      ],
      inGame: false,
      bonusPosition: undefined
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
      if (this.bonusPosition) {
        objects.push({
          x: this.bonusPosition[0],
          y: this.bonusPosition[1],
          component: "bonus",
          id: "bonus"
        })
      }
      return objects
    },
    headOffset(){
      let head = this.snakeParts[0]
      let headSize = this.$el.offsetHeight / this.rows
      let x = head[0] * headSize - headSize / 2
      let y = head[1] * headSize - headSize / 2
      let offsetX = this.$refs.grid.offsetLeft + x
      let offsetY = this.$refs.grid.offsetTop + y
      return [offsetX, offsetY]
    }
  },
  methods:{
    moveLeftOrRight(x){
      let moveRight = x > this.headOffset[0]
      this.nextDirection = [moveRight ? 1 : -1, 0]
    },
    moveUpOrDown(y){
      let moveDown = y > this.headOffset[1]
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
      console.log("game over")
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
        if (newHeadPos.join() === this.bonusPosition.join()) {
          this.popBonus()
        } else {
          this.snakeParts.pop()
        }
        this.headDirection = this.nextDirection
        this.snakeParts.unshift(newHeadPos)
        this.requestNextFrame()
      }
    },
    popBonus(){
      let x, y, ok = false
      while (!ok) {
        x = random(1, this.columns)
        y = random(1, this.rows)
        ok = !this.snakeCollision([x,y])
      }
      this.bonusPosition = [x,y]
    },
    requestFullscreen(){
      this.$el.requestFullscreen()
    },
    requestNextFrame(){
      setTimeout(this.move, 400)
    },
    handleClick(e){
      if (!this.inGame) {
        this.inGame = true
        this.requestNextFrame()
        this.popBonus()
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