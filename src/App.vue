<template>
  <div id="app" :class="`drunk-level-${$store.getters.drunkLevel}`">
    <modal
      v-model="showStartModal"
      :button="button"
      title="Dom at Home"
      @click="start"
      :disabled="disableButton"
    >
      <p>
        Toujours pas de fête du Crêt-Vaillant cette année! 😢
        Du coup, Dom reste chez lui et bois des pastis quoi...
        Et plus il boit, plus sa barbe pousse, oui c'est étrange.
      </p>
      <p>
        Vous l'aurez compris, le but du jeu est de boire le plus de pastis
        possible, sans manger sa barbe.
      </p>
      <p>
        Attention tout de même à ne pas abuser, quand il est bourré,
        Dom se met à faire n'importe quoi!<br>
        Dans ces cas, un petit cervelas ne fait pas de mal.
      </p>
    </modal>
    <game>
      <transition name="fade">
        <div v-if="showHelper" class="helper">
          <img v-if="$root.mobile" src="@/assets/swipe-helper.gif">
          <img v-else src="@/assets/arrows-helper.gif">
        </div>
      </transition>
    </game>
    <div class="credits">
      <h3 class="arcade-font">Crédits</h3>
      <dt>Développement</dt>
      <dd>Joaquim Perez</dd>
      <dt>Musique</dt>
      <dd><a href="https://bacalao.ch/cheatcodes.html">Bacalao - Cheat Codes</a></dd>
      <dt>Bruitages</dt>
      <dd>Domingos Cardoso</dd>
      <p>2021 - Fête du Crêt-Vaillant</p>
    </div>
  </div>
</template>

<script>
import "fullscreen-api-polyfill"
import Modal from "@/Modal"
import Game from "@/Game"

export default {
  components: { Game, Modal },
  data(){
    return {
      showStartModal: true,
      showHelper: false,
      button: "Jouer",
      disableButton: false
    }
  },
  methods:{
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    start(){
      this.$store.state.sounds.startMusic.play()
      this.button = "2"
      this.disableButton = true
      setInterval(() => {
        this.button--
      }, 500)
      setTimeout(() => {
        this.showStartModal = false
        this.$store.dispatch('start')
        this.showHelper = true
        setTimeout(() => this.showHelper = false, 2000)
      }, 1000)
    },
    resize() {
      let div = document.getElementById('game')
      let h = window.innerHeight
      let w = window.innerWidth
      // for 9/16 screens or narrower
      div.style.height = h + 'px'
      div.style.width = (h * 9/16) + 'px'
      // if screen is wider than 9/16
      // we force height to maintain 9/16 according to width
      div.style.maxHeight = (w * 16/9) + 'px'
      div.style.maxWidth = w + 'px'
    }
  },
  mounted() {
    this.resize()
    window.onresize = this.resize
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Press+Start+2P&display=swap');
.arcade-font{
  font-family: "Press Start 2P", cursive;
}
html,body{
  padding:0;
  margin:0;
  font-family: 'Open Sans', sans-serif;
  background-color: #53b45a;
}
#app{
  background-image: url("./assets/background50.png"), url("./assets/background50.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
}
.helper{
  position: absolute;
  top:100px;
  left: 0;
  right: 0;
  opacity: 0.5;
  img{
    max-width: 30%;
  }
}
.credits{
  h3{
    margin: 0 0 20px;
  }
  p{
    margin: 20px 0 0;
  }
  padding: 20px;
  width: 220px;
  background-color: white;
  margin: 60px auto;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>