import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import { Howl } from 'howler'

import { sample, range, difference, product } from 'lodash'

import { BodyPart, Head, Drink, Food } from '@/GameObjects'

function initialState () { 
  return {
    gameId: 0,
    score: 0,
    over: false,
    drunkenness: 0,
    drunkLimits: [3, 6, 12, 18],
    soberPercent: 0.2,
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
    music: new Howl({
      src: ['music.mp3'],
      loop: true,
      volume: localStorage.volume || 1
    }),
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
    drunkLevel: ({ gameOver, drunkenness, drunkLimits }) => {
      if (gameOver) return 0
      let level = drunkLimits.findIndex(v => drunkenness < v)
      return level < 0 ? drunkLimits.length : level
    },
    max: ({ drunkLimits }) => {
      return drunkLimits[drunkLimits.length-1]
    },
    ratio: ({ drunkenness }, { max }) => {
      return Math.min(1, drunkenness / max)
    },
  },

  mutations: {
    reset (state) {
      Object.assign(state, initialState())
      state.music.rate(1)
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
      state.drunkenness++
    },
    sober (state) {
      let portion = state.soberPercent * state.drunkenness
      state.drunkenness = state.drunkenness - portion
    },
    stopMusic ({ music }) {
      var rate = 1
      var slowDown = setInterval(() => {
        rate = rate - rate/5
        music.rate(rate)
      }, 50)
      setTimeout(() => {
        music.fade(1, 0, 200)
        clearInterval(slowDown)
      }, 800)
    },
    setVolume ({ music }, volume) {
      localStorage.volume = volume
      music.volume(volume)
    }
  },

  actions: {
    start ({ dispatch, state }) {
      dispatch('frame')
      dispatch('spawnDrink')
      dispatch('scheduleFoodSpawn')
      state.music.play()
    },
    restart ({ commit, dispatch }) {
      commit('reset')
      dispatch('start')
    },
    frame ({ state, getters, dispatch }) {
      if (state.over) { return }
      frameTimeout = setTimeout(
        () => dispatch('frame'),
        1000 / getters.fps
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
      }
    },
    changeDirection({ state, getters, commit }, directions){
      if (state.over) { return }
      if (getters.verticalMove) {
        if (directions.left) {
          commit('setNextDir', [-1,0])
        } else if (directions.right) {
          commit('setNextDir', [1,0])
        }
      } else {
        if (directions.top) {
          commit('setNextDir', [0,-1])
        } else if (directions.bottom) {
          commit('setNextDir', [0,1])
        }
      }
    },
    drinkDrink ({ commit, dispatch }) {
      commit('incrementScore')
      commit('booze')
      dispatch('spawnDrink')
    },
    eatFood ({ commit }) {
      commit('removeFood')
      commit('sober')
    },
    spawnFoodAndSchedule ({ state, commit, dispatch }) {
      dispatch('spawnFood')
      foodTimeout = setTimeout(() => {
        commit('removeFood')
        dispatch('scheduleFoodSpawn')
      }, 5000)
    },
    scheduleFoodSpawn ({ dispatch }) {
      foodTimeout = setTimeout(() => {
        dispatch('spawnFoodAndSchedule')
      }, 15000)
    },
    gameOver ({ state, commit }) {
      clearTimeout(foodTimeout)
      clearTimeout(frameTimeout)
      state.over = true
      commit('stopMusic')
      state.drunkenness = 0
    }
  }
})