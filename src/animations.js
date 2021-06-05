import Vue from 'vue'

Vue.directive('sway', {
  inserted: function (el, binding) {
    let store = binding.value
    let seconds = 4
    el.style.transition = `transform ${seconds}s ease-in-out`
    let i = 0
    setInterval(() => {
      let multiplier = 2 * (i % 2) - 1
      let positiveDeg = [0, 1, 4, 12][store.getters.drunkLevel]
      console.log(store.getters.drunkLevel, positiveDeg)
      let deg = multiplier * (positiveDeg || 0)
      el.style.transform = `rotate(${deg}deg)`
      i++
    }, seconds * 1000)
  }
})