import Vue from 'vue'
import Vuex from 'vuex'

import game from './game'
import scene from './scene'
import alcohol from './alcohol'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { game, scene, alcohol },

  actions: {
    gameOver ({ rootState }) {
      rootState.game.over = true
    },
    restart ({ commit, dispatch }) {
      commit('game/reset')
      commit('scene/reset')
      commit('alcohol/reset')
      dispatch('game/start')
    }
  }
})