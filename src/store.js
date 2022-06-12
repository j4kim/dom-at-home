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
    mobile: null,
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
    musicIsLoaded: false,
    sounds: {
      music: load('music', true, () => {
        store.commit('musicLoaded')
      }),
      startMusic: load('start'),
      effects: {
        onDrink: many('sip', 'santé', 'aah'),
        onEat: many('miam', 'rmrm'),
        onDeath: many('aie', 'aou'),
        onVomit: many('beurk')
      }
    },
    muted,
    vomit: false,
    credits: 0
  }
}

let frameTimeout, foodTimeout;


var store = new Vuex.Store({

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
    fps ({ score, mobile }) {
      // https://www.wolframalpha.com/input/?i=plot+14+-+12+%2F+%280.016+*+x+%2B+1%29%2C+12+-+10+%2F+%280.016+*+x+%2B+1%29+from+x%3D0+to+50
      let limit = mobile ? 12 : 14
      return limit - ((limit - 2) / (0.016 * score + 1))
    },
    drunkLevel: ({ gameOver, drunkenness }) => {
      if (gameOver) return 0
      return Math.min(3, Math.floor(drunkenness / 3))
    },
    canPlay: ({ musicIsLoaded, credits }) => {
      return musicIsLoaded && credits
    }
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
      let dim = 0.5 + state.drunkenness / 6
      state.drunkenness = Math.max(0, state.drunkenness - dim)
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
    },
    musicLoaded (state) {
      state.musicIsLoaded = true
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
        let amount = 0.25 + (state.drunkenness - 9) / 3 // [0.25,1.25]
        sin = 1 + sin * amount // [1.25,2.25]
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
          let chance = (state.drunkenness - 9) / 40 // [0,0.075]
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
    spawnFoodAndSchedule ({ getters, commit, dispatch }) {
      dispatch('spawnFood')
      let s = getters.drunkLevel < 3 ? random(4, 9) : random(1, 8)
      foodTimeout = setTimeout(() => {
        commit('removeFood')
        dispatch('scheduleFoodSpawn')
      }, 1000 * s)
    },
    scheduleFoodSpawn ({ getters, dispatch }) {
      let s = getters.drunkLevel < 3 ? random(0, 12) : random(0, 1)
      foodTimeout = setTimeout(() => {
        dispatch('spawnFoodAndSchedule')
      }, 1000 * s)
    },
    gameOver ({ state, getters, commit }) {
      clearTimeout(foodTimeout)
      clearTimeout(frameTimeout)
      state.over = true
      commit('stopMusic')
      commit('playSoundEffect', 'onDeath')
      commit('stopMusic')
      if (getters.drunkLevel >= 2) {
        commit('playSoundEffect', 'onVomit')
        setTimeout(() => {
          state.vomit = true
        }, 750)
      }
    }
  }
})

export default store