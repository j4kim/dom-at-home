import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    score: 0,
    drunkenness: 0,
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