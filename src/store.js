import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => ({
  score: 0,
  drunkenness: 0,
  drunkLimits: [3, 6, 12, 18],
  soberPercent: 0.2,
  gameOver: false
})


export default new Vuex.Store({
  state: getDefaultState,
  getters: {
    drunkLevel: ({ gameOver, drunkenness, drunkLimits }) => {
      if (gameOver) return 0
      let level = drunkLimits.findIndex(v => drunkenness < v)
      return level < 0 ? drunkLimits.length : level
    },
    rotation: (state, { drunkLevel }) => {
      return drunkLevel
    },
    blur: (state, { drunkLevel }) => {
      return drunkLevel / 2
    }
  },
  mutations: {
    reset (state) {
      Object.assign(state, getDefaultState())
    },
    drink (state) {
      state.score++
      state.drunkenness++
    },
    eat (state) {
      let portion = state.soberPercent * state.drunkenness
      state.drunkenness = state.drunkenness - portion
    },
    setGameOver (state) {
      state.gameOver = true
    }
  }
})