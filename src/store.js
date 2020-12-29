import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => ({
  score: 0,
  drunkenness: 0
})


export default new Vuex.Store({
  state: getDefaultState,
  getters: {
    drunkLevel: ({ drunkenness }) => {
      return [5, 15, 30, 60].findIndex(v => drunkenness <= v)
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