import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    score: 0,
    drunkenness: 0,
  },
  getters: {
    rotation: state => {
      return state.drunkenness / 5
    },
    blur: state => {
      return state.drunkenness / 10
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