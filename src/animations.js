import Vue from 'vue'

Vue.directive('sway', {
  inserted: function (el, binding) {
    let store = binding.value
    let seconds = 4
    el.style.transition = `transform ${seconds}s ease-in-out`
    let i = 0
    setInterval(() => {
      let deg = 0
      if (!store.state.over) {
        let multiplier = 2 * (i % 2) - 1
        let positiveDeg = [0, 1, 4, 12][store.getters.drunkLevel]
        deg = multiplier * (positiveDeg || 0)
      }
      el.style.transform = `rotate(${deg}deg)`
      i++
    }, seconds * 1000)
  }
})

Vue.directive('fuzz', {
  inserted (el, binding) {
    let store = binding.value
    let seconds = 4
    el.style.transition = `background-position-x ${seconds}s ease-in-out`
    let i = 0
    setInterval(() => {
      let amp = store.state.drunkenness / 3
      let multiplier = 2 * (i % 2) - 1
      let diff = amp * multiplier
      let pos1 = 50 + diff
      let pos2 = 50 - diff
      el.style.backgroundPositionX = `${pos1}%, ${pos2}%`
      i++
    }, seconds * 1000)
  }
})