<template>
  <div id="app" :class="`drunk-level-${$store.getters.drunkLevel}`">
    <modal
      v-model="showStartModal"
      button="Jouer"
      title="Dom at Home"
      @input="start"
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
      showHelper: false
    }
  },
  methods:{
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    start(){
      this.$store.dispatch('start')
      this.showHelper = true
      setTimeout(() => this.showHelper = false, 2000)
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
@import './animations.scss';
.arcade-font{
  font-family: "Press Start 2P", cursive;
}
html,body{
  padding:0;
  margin:0;
  font-family: 'Open Sans', sans-serif;
  background-color: #53b45a;
  overflow: hidden;
}
#app{
  background-image: url("./assets/background50.png"), url("./assets/background50.png");
  background-repeat: no-repeat;
  background-size: cover;
  image-rendering: pixelated;
  overflow: hidden;
}
#game{
  margin: auto;
  text-align: center;
  position: relative;
  background-image: url("./assets/house.png");
  background-size: cover;
  image-rendering: pixelated;
  background-repeat: no-repeat;
  overflow: hidden;
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
      &#house-bottom{
        background-color: #5f7084;
        color: white;
        padding: 10px;
        margin: 5px 2px;
        display: flex;
        justify-content: space-between;
        >div {
          flex: 1;
          max-width: 30%;
          &.game-over {
            align-self: center;
            font-size: 2.5vh;
          }
          button {
            align-self: stretch;
            font-size: 1.8vh;
            width: 100%;
            border: none;
            background-color: #fff;
            height: 100%;
          }
        }
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