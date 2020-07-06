<template>
  <div id="app">
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
    <game :running="gameRunning"></game>
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
      gameRunning: false,
    }
  },
  methods:{
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    start(){
      this.gameRunning = true
    },
  },
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
}
#game{
  height: 100vh;
  width: 56.25vh; /* 16/9 = 0.5625 */ 
  max-height: 177.78vw; /* 9/16 = 1.77... */ 
  max-width: 100vw;
  margin: auto;
  text-align: center;
  position: relative;
  background-image: url("../public/house.png");
  background-size: contain;
  image-rendering: pixelated;
  >div{
    width: 100%;
    position: absolute;
    &#score-container{
      top: 8%;
    }
    &#grid-container{
      top: 17%;
    }
    >div{
      margin: auto;
      &#score{
        background-color: white;
        font-size: 1.4rem;
        padding: .8rem .8rem .6rem;
        display: inline-block;
      }
      &#grid{
        width: 85%;
        display: grid;
        background-color: lightblue;
      }
    }
  }
}
</style>