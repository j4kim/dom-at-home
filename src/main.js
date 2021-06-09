import Vue from 'vue'
import App from './App.vue'

import isMobile from 'ismobilejs';
const mobile = isMobile(window.navigator).any;

import store from './store'

store.state.mobile = mobile

import '@/animations'
import './registerServiceWorker'

// https://stackoverflow.com/a/21712356/8345160
if (window.document.documentMode) {
  document.getElementById("app").innerHTML = "Le jeu n'est pas compatible avec votre navigateur, déso"
  throw new Error("IE")
}

new Vue({
  render: h => h(App),
  data: { mobile },
  store
}).$mount('#app')
