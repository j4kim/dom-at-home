<template>
  <div id="app" @click="handleClick">
    <modal v-model="showStartModal" button="Jouer">
      <h2>Dom at Home</h2>
    </modal>
    <div id="game" ref="game">
      <div id="score-container">
        <div id="score">{{ score }}</div>
      </div>
      <div id="grid-container">
        <div id="grid" ref="grid" :style="{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
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
    </div>
  </div>
</template>

<script>
import { random } from "lodash"
import "fullscreen-api-polyfill"
import SwipeListener from 'swipe-listener';

import DomHead from "@/DomHead"
import DomBeard from "@/DomBeard"
import Bonus from "@/Bonus"
import Modal from "@/Modal"

export default {
  components: { DomHead, DomBeard, Bonus, Modal },
  data(){
    return {
      columns: 11,
      rows: 16,
      headDirection: [0,-1],
      nextDirection: [0,-1],
      snakeParts: [
        [6,14],
        [6,15],
      ],
      inGame: false,
      bonusPosition: undefined,
      score: 0,
      showStartModal: true
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
    verticalMove(){
      return this.headDirection[0] === 0
    }
  },
  methods:{
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
      let tailPart = this.snakeParts.pop()
      if (this.collision(newHeadPos)) {
        this.gameOver()
      } else {
        this.headDirection = this.nextDirection
        this.snakeParts.unshift(newHeadPos)
        if (newHeadPos.join() === this.bonusPosition.join()) {
          this.drink()
          this.snakeParts.push(tailPart)
        }
        this.requestNextFrame()
      }
    },
    drink(){
      this.score++
      this.popBonus()
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
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    requestNextFrame(){
      setTimeout(this.move, 200)
    },
    handleClick(e){
      if (!this.inGame) {
        this.inGame = true
        this.requestNextFrame()
        this.popBonus()
      }
    },
    changeDirection(directions){
      if (this.verticalMove) {
        if (directions.left) {
          this.nextDirection = [-1,0]
        } else if (directions.right) {
          this.nextDirection = [1,0]
        }
      } else {
        if (directions.top) {
          this.nextDirection = [0,-1]
        } else if (directions.bottom) {
          this.nextDirection = [0,1]
        }
      }
    }
  },
  mounted(){
    SwipeListener(this.$refs.grid, {
      preventScroll: true,
      deltaHorizontal: 1,
      deltaVertical: 1
    })
    this.$refs.grid.addEventListener("swipe", e => {
      this.changeDirection(e.detail.directions)
    })
    document.addEventListener("keydown", e => {
      let keyBinding = {
        37: "left",
        38: "top",
        39: "right",
        40: "bottom"
      }
      let directions = {}
      directions[keyBinding[e.keyCode]] = true
      this.changeDirection(directions)
    })
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
html,body{
  padding:0;
  margin:0;
}
#game{
  font-family: "Press Start 2P", cursive;
  height: 100vh;
  width: 56.25vh; /* 16/9 = 0.5625 */ 
  max-height: 177.78vw; /* 9/16 = 1.77... */ 
  max-width: 100vw;
  margin: auto;
  text-align: center;
  position: relative;
  background-image: url("../public/house.png");
  background-size: contain;
  image-rendering: pixelated;
  >div{
    width: 100%;
    position: absolute;
    &#score-container{
      top: 8%;
    }
    &#grid-container{
      top: 17%;
    }
    >div{
      margin: auto;
      &#score{
        background-color: white;
        font-size: 1.4rem;
        padding: .8rem .8rem .6rem;
        display: inline-block;
      }
      &#grid{
        width: 85%;
        display: grid;
        background-color: lightblue;
      }
    }
  }
}
</style>