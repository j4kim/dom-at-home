import Vue from 'vue'
import App from './App.vue'

import isMobile from 'ismobilejs';
const mobile = isMobile(window.navigator).any;

Vue.config.productionTip = false

// https://stackoverflow.com/a/21712356/8345160
if (window.document.documentMode) {
  document.getElementById("app").innerHTML = "Le jeu n'est pas compatible avec votre navigateur, déso"
  throw new Error("IE")
}

new Vue({
  render: h => h(App),
  data: { mobile }
}).$mount('#app')
