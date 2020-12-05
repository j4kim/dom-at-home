<template>
  <div id="game" ref="game">
    <div id="score-container">
      <div id="score" class="arcade-font">{{ score }}</div>
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
          v-bind="o"
        >
        </component>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { random } from "lodash"
import SwipeListener from 'swipe-listener';

import DomHead from "@/objects/DomHead"
import DomBeard from "@/objects/DomBeard"
import Bonus from "@/objects/Bonus"

function initialState(){ 
  return {
    columns: 11,
    rows: 16,
    headDirection: [0,-1],
    nextDirection: [0,-1],
    snakeParts: [
      [6,14],
      [6,15],
    ],
    drinkPos: undefined,
    score: 0,
    isGameOver: false,
  }
}

export default {
  components: { DomHead, DomBeard, Bonus },
  props: [
    "running"
  ],
  watch: {
    running(bool){
      bool ? this.start() : null
    },
  },
  data: initialState,
  computed: {
    sceneObjects(){
      let objects = []
      this.snakeParts.forEach((part, i) => {
        objects.push({
          x: part[0],
          y: part[1],
          component: i === 0 ? "dom-head" : "dom-beard",
          direction: this.nextDirection,
          id: i,
          crashed: this.isGameOver
        })
      })
      if (this.drinkPos) {
        objects.push({
          x: this.drinkPos[0],
          y: this.drinkPos[1],
          component: "bonus",
          id: "drink",
          asset: "ricard"
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
      this.isGameOver = true
    },
    gameLoop(){
      if (this.running && !this.isGameOver){
        this.move()
      }
    },
    start(){
      this.popDrink()
    },
    restart(){
      Object.assign(this.$data, initialState())
      this.popDrink()
      this.isGameOver = false
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
        if (newHeadPos.join() === this.drinkPos.join()) {
          this.drink()
          this.snakeParts.push(tailPart)
        }
      }
    },
    drink(){
      this.score++
      this.popDrink()
    },
    popDrink(){
      let x, y, ok = false
      while (!ok) {
        x = random(1, this.columns)
        y = random(1, this.rows)
        ok = !this.snakeCollision([x,y])
      }
      this.drinkPos = [x,y]
    },
    changeDirection(directions){
      if (this.isGameOver) { return }
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
    setInterval(this.gameLoop, 200)
    SwipeListener(this.$refs.grid, {
      preventScroll: true,
      deltaHorizontal: 1,
      deltaVertical: 1
    })
    this.$refs.grid.addEventListener("swipe", e => {
      this.changeDirection(e.detail.directions)
    })
    document.addEventListener("keydown", e => {
      if (e.code === "KeyR"){
        this.restart()
      }
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