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
import 'lodash.product'
import { sample, range, difference, product } from 'lodash'
import SwipeListener from 'swipe-listener'

import DomHead from "@/objects/DomHead"
import DomBeard from "@/objects/DomBeard"
import Bonus from "@/objects/Bonus"

import { BodyPart, Head, Drink, Food } from "@/GameObjects"

function initialState(){ 
  return {
    fps: 5,
    columns: 11,
    rows: 16,
    bodyParts: [ new BodyPart([6,15]) ],
    head: new Head([6,14], [0,-1]),
    drink: new Drink(),
    food: new Food(),
    score: 0,
    isGameOver: false,
  }
}

export default {
  components: { DomHead, DomBeard, Bonus },
  props: [ "running" ],
  watch: {
    running(bool){
      bool ? this.start() : null
    },
  },
  data: initialState,
  computed: {
    sceneObjects(){
      return [
        this.head,
        ...this.bodyParts,
        this.drink,
        this.food
      ].filter(o => o.pos)
    },
    verticalMove(){
      return this.head.dir[0] === 0
    },
    allPositions() {
      let columns = range(1, this.columns + 1)
      let rows = range(1, this.rows + 1)
      return product(columns, rows).map(pos => pos.join())
    },
    objectPositions(){
      return this.sceneObjects.map(o => o.pos.join())
    },
    availablePositions(){
      return difference(this.allPositions, this.objectPositions)
    }
  },
  methods:{
    gameOver(){
      this.head.crashed = true
      this.isGameOver = true
    },
    gameLoop(){
      if (this.running && !this.isGameOver){
        this.move()
      }
    },
    scheduleFoodSpawn(){
      setTimeout(() => this.spawnFood(), 15000)
    },
    start(){
      this.spawnDrink()
      this.scheduleFoodSpawn()
    },
    restart(){
      Object.assign(this.$data, initialState())
      this.spawnDrink()
      this.isGameOver = false
    },
    snakeCollision(pos){
      return this.bodyParts.some(part => part.hits(pos))
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
      let newHeadPos = this.head.nextPos()
      let tailPart = this.bodyParts.pop()
      if (this.collision(newHeadPos)) {
        this.gameOver()
      } else {
        this.bodyParts.unshift(new BodyPart(this.head.pos))
        this.head.move()
        if (this.drink.hits(newHeadPos)) {
          this.drinkDrink()
          this.bodyParts.push(tailPart)
        } else if (this.food.hits(newHeadPos)) {
          this.eatfood()
        }
      }
    },
    drinkDrink(){
      this.score++
      this.spawnDrink()
    },
    eatfood() {
      this.food.pos = undefined
    },
    randomPos(){
      return sample(this.availablePositions).split(',')
    },
    spawnDrink(){
      this.drink.pos = this.randomPos()
    },
    spawnFood(){
      this.food.pos = this.randomPos()
      setTimeout(() => {
        this.food.pos = undefined
        this.scheduleFoodSpawn()
      }, 5000)
    },
    changeDirection(directions){
      if (this.isGameOver) { return }
      if (this.verticalMove) {
        if (directions.left) {
          this.head.nextDir = [-1,0]
        } else if (directions.right) {
          this.head.nextDir = [1,0]
        }
      } else {
        if (directions.top) {
          this.head.nextDir = [0,-1]
        } else if (directions.bottom) {
          this.head.nextDir = [0,1]
        }
      }
    }
  },
  mounted(){
    setInterval(this.gameLoop, 1000/this.fps)
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