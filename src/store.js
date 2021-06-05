import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { load, many, mute } from '@/sounds'

import { sample, range, difference, product, random } from 'lodash'

import { BodyPart, Head, Drink, Food } from '@/GameObjects'

let muted = localStorage.muted === 'true'
mute(muted)

function initialState () { 
  return {
    gameId: 0,
    score: 0,
    over: false,
    drunkenness: 0,
    grid: {
      columns: 11,
      rows: 16
    },
    snake: {
      bodyParts: [ new BodyPart([6,15]) ],
      head: new Head([6,14], [0,-1]),
    },
    drink: new Drink(),
    food: new Food(),
    sounds: {
      music: load('music', true),
      startMusic: load('start'),
      effects: {
        onDrink: many('sip', 'santé', 'aah'),
        onEat: many('miam', 'rmrm'),
        onDeath: many('aie', 'aou'),
        onVomit: many('beurk')
      }
    },
    muted
  }
}

let frameTimeout, foodTimeout;


export default new Vuex.Store({

  state: initialState,

  getters: {
    objects (state) {
      return [
        state.snake.head,
        ...state.snake.bodyParts,
        state.drink,
        state.food
      ].filter(o => o.pos)
    },
    verticalMove({ snake }){
      return snake.head.dir[0] === 0
    },
    allPositions({ grid }) {
      let columns = range(1, grid.columns + 1)
      let rows = range(1, grid.rows + 1)
      return product(columns, rows).map(pos => pos.join())
    },
    objectPositions(state, { objects }){
      return objects.map(o => o.pos.join())
    },
    availablePositions(state, getters){
      return difference(getters.allPositions, getters.objectPositions)
    },
    snakeCollision: ({ snake }) => (pos) => {
      return snake.bodyParts.some(part => part.hits(pos))
    },
    wallCollision: ({ grid }) => (pos) => {
      return (
        pos[0] < 1 ||
        pos[0] > grid.columns ||
        pos[1] < 1 ||
        pos[1] > grid.rows
      )
    },
    collision: (state, getters) => (pos) => {
      return getters.snakeCollision(pos) || getters.wallCollision(pos)
    },
    randomPos: (state, getters) => {
      let pos = sample(getters.availablePositions)
      return pos ? pos.split(',') : undefined
    },
    fps ({ score }) {
      return 14 - 12 / (0.02 * score + 1)
    },
    drunkLevel: ({ gameOver, drunkenness }) => {
      if (gameOver) return 0
      return Math.min(3, Math.floor(drunkenness / 3))
    },
  },

  mutations: {
    reset (state) {
      Object.assign(state, initialState())
      state.sounds.music.rate(1)
    },
    addBodyPart ({ snake }, bodyPart) {
      snake.bodyParts.push(bodyPart)
    },
    insertBodyPart ({ snake }, bodyPart) {
      snake.bodyParts.unshift(bodyPart)
    },
    setNextDir ({ snake }, dir) {
      snake.head.nextDir = dir
    },
    setDrinkPos ({ drink }, pos) {
      drink.pos = pos
    },
    setFoodPos ({ food }, pos) {
      food.pos = pos
    },
    removeFood({ food }){
      food.pos = null
    },
    incrementScore (state) {
      state.score++
    },
    booze (state) {
      state.drunkenness = Math.min(12, state.drunkenness + 0.5)
    },
    sober (state) {
      state.drunkenness = Math.max(0, state.drunkenness - 2)
    },
    stopMusic ({ sounds }) {
      var rate = 1
      var slowDown = setInterval(() => {
        rate = rate - rate/5
        sounds.music.rate(rate)
      }, 50)
      setTimeout(() => {
        sounds.music.fade(1, 0, 200)
        clearInterval(slowDown)
      }, 800)
    },
    mute (state, muted) {
      mute(muted)
      state.muted = localStorage.muted = muted
    },
    playSoundEffect ({ sounds }, effectType) {
      sample(sounds.effects[effectType]).play()
    }
  },

  actions: {
    start ({ dispatch, state }) {
      dispatch('frame')
      dispatch('spawnDrink')
      dispatch('scheduleFoodSpawn')
      state.sounds.music.play()
    },
    restart ({ commit, dispatch }) {
      commit('reset')
      dispatch('start')
    },
    frame ({ state, getters, dispatch }) {
      if (state.over) { return }
      let sin = 1
      if (getters.drunkLevel === 3) {
        let x = Math.PI * Date.now() / 2000
        sin = (1 + Math.sin(x)) / 2 // [0,1]
        let amount = 0.5 + (state.drunkenness - 9) / 3 // [0.5,1.5]
        sin = 1 + sin * amount // [1.5,2.5]
        console.log(sin, amount, state.drunkenness)
      }
      frameTimeout = setTimeout(
        () => dispatch('frame'),
        1000 / (getters.fps * sin)
      )
      dispatch('move')
    },
    spawnDrink({ commit, getters }){
      commit('setDrinkPos', getters.randomPos)
    },
    spawnFood({ commit, getters }){
      commit('setFoodPos', getters.randomPos)
    },
    move ({ state, getters, commit, dispatch }) {
      let newHeadPos = state.snake.head.nextPos()
      let tailPart = state.snake.bodyParts.pop()
      if (getters.collision(newHeadPos)) {
        dispatch('gameOver')
      } else {
        if (state.drink.hits(newHeadPos)) {
          commit('addBodyPart', new BodyPart(tailPart.pos))
          dispatch('drinkDrink')
        } else if (state.food.hits(newHeadPos)) {
          dispatch('eatFood')
        }
        tailPart.pos = state.snake.head.pos
        commit('insertBodyPart', tailPart)
        state.snake.head.move()
        if (getters.drunkLevel === 3) {
          let chance = (state.drunkenness - 8) / 40 // [0.02,0.1]
          if (Math.random() < chance) {
            let randomDir = sample(['left', 'right', 'up', 'down'])
            dispatch('changeDirection', randomDir)
          }
        }
      }
    },
    changeDirection({ state, getters, commit }, dir){
      if (state.over) { return }
      if (getters.verticalMove) {
        if (dir === 'left') {
          commit('setNextDir', [-1,0])
        } else if (dir === 'right') {
          commit('setNextDir', [1,0])
        }
      } else {
        if (dir === 'up') {
          commit('setNextDir', [0,-1])
        } else if (dir === 'down') {
          commit('setNextDir', [0,1])
        }
      }
    },
    drinkDrink ({ commit, dispatch }) {
      commit('incrementScore')
      commit('booze')
      commit('playSoundEffect', 'onDrink')
      dispatch('spawnDrink')
    },
    eatFood ({ commit }) {
      commit('removeFood')
      commit('sober')
      commit('playSoundEffect', 'onEat')
    },
    spawnFoodAndSchedule ({ state, commit, dispatch }) {
      dispatch('spawnFood')
      foodTimeout = setTimeout(() => {
        commit('removeFood')
        dispatch('scheduleFoodSpawn')
      }, random(3000, 10000))
    },
    scheduleFoodSpawn ({ dispatch }) {
      foodTimeout = setTimeout(() => {
        dispatch('spawnFoodAndSchedule')
      }, random(10000, 20000))
    },
    gameOver ({ state, commit }) {
      clearTimeout(foodTimeout)
      clearTimeout(frameTimeout)
      state.over = true
      commit('stopMusic')
      commit('playSoundEffect', 'onDeath')
      state.drunkenness = 0
    }
  }
})