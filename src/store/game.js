function initialState () { 
  return {
    score: 0,
    over: false,
    fps: 4,
  }
}

export default {
  namespaced: true,

  state: initialState,

  getters: {
    tempo (state) {
      return state.fps * 60
    } 
  },

  mutations: {
    reset (state) {
      Object.assign(state, initialState())
    },
    incrementScore (state) {
      state.score++
    }
  },

  actions: {
    start ({ dispatch }) {
      dispatch('frame')
      dispatch('scene/spawnDrink', null, { root: true })
      dispatch('scheduleFoodSpawn')
    },
    frame ({ state, dispatch }) {
      if (state.over) { return }
      dispatch('scene/move', null, { root: true })
      setTimeout(() => dispatch('frame'), 1000 / state.fps)
    },
    drinkDrink ({ commit, dispatch }) {
      commit('incrementScore')
      commit('alcohol/booze', null, { root: true })
      dispatch('scene/spawnDrink', null, { root: true })
    },
    eatFood ({ commit }) {
      commit('scene/removeFood', null, { root: true })
      commit('alcohol/sober', null, { root: true })
    },
    spawnFoodAndSchedule ({ state, commit, dispatch }) {
      if (state.over) { return }
      dispatch('scene/spawnFood', null, { root: true })
      setTimeout(() => {
        commit('scene/removeFood', null, { root: true })
        dispatch('scheduleFoodSpawn')
      }, 5000)
    },
    scheduleFoodSpawn ({ dispatch }) {
      setTimeout(() => {
        dispatch('spawnFoodAndSchedule')
      }, 15000)
    }
  }
}