import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => ({
  score: 0,
  drunkenness: 0,
  drunkLimits: [1, 2, 3]
})


export default new Vuex.Store({
  state: getDefaultState,
  getters: {
    drunkLevel: ({ drunkenness, drunkLimits }) => {
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
      state.drunkenness = Math.max(0, state.drunkenness-10)
    }
  }
})