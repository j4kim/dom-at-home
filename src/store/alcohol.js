function initialState () { 
  return {
    drunkenness: 0,
    drunkLimits: [3, 6, 12, 18],
    soberPercent: 0.2,
  }
}

export default {
  namespaced: true,

  state: initialState,

  getters: {
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
    rotation: (state, { drunkLevel }) => {
      return drunkLevel
    },
    blur: (state, { drunkLevel }) => {
      return drunkLevel / 2
    }
  },

  mutations: {
    reset (state) {
      Object.assign(state, initialState())
    },
    booze (state) {
      state.drunkenness++
    },
    sober (state) {
      let portion = state.soberPercent * state.drunkenness
      state.drunkenness = state.drunkenness - portion
    }
  }
}