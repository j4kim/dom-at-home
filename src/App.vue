<template>
  <div id="app" :class="`drunk-level-${$store.getters.drunkLevel}`">
    <modal
      v-model="showStartModal"
      button="Jouer"
      title="Dom at Home"
      @input="start"
    >
      <p>
        Pas de fête du Crêt-Vaillant cette année!
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
    <game :running="gameRunning">
      <transition name="fade">
        <div v-if="showHelper" class="helper">
          <img v-if="$root.mobile" src="@/assets/swipe-helper.gif">
          <img v-else src="@/assets/arrows-helper.gif">
        </div>
      </transition>
    </game>
  </div>
</template>

<script>
import "fullscreen-api-polyfill"
import { mapGetters } from 'vuex'
import Modal from "@/Modal"
import Game from "@/Game"

export default {
  components: { Game, Modal },
  data(){
    return {
      showStartModal: true,
      gameRunning: false,
      showHelper: false
    }
  },
  computed: mapGetters(['rotation', 'blur']),
  methods:{
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    start(){
      this.gameRunning = true
      this.showHelper = true
      setTimeout(() => this.showHelper = false, 2000)
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Press+Start+2P&display=swap');
@import './animations.scss';
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
#game{
  height: 100vh;
  width: 56.25vh; /* 16/9 = 0.5625 */ 
  max-height: 177.78vw; /* 9/16 = 1.77... */ 
  max-width: 100vw;
  margin: auto;
  text-align: center;
  position: relative;
  background-image: url("./assets/house.png");
  background-size: cover;
  image-rendering: pixelated;
  >div{
    width: 100%;
    position: absolute;
    &#score-container{
      top: 8.11%; // 30/370 = 0.08108
    }
    &#grid-container{
      top: 17.03%; // 63/370 = 0.17027
    }
    >div{
      margin: auto;
      &#score{
        background-color: white;
        font-size: 2.1vh;
        height: 4.32vh; // 16/370
        line-height: 4.32vh;
        padding: 0 2vh;
        display: inline-block;
      }
      &#grid{
        width: 84.61%; // 11/13 = 0.8461
        display: grid;
      }
    }
  }
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
.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>