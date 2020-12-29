import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    score: 0,
    drunkenness: 0
  },
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
    drink (state) {
      state.score++
      state.drunkenness++
    },
    eat (state) {
      state.drunkenness -= 10
    }
  }
})