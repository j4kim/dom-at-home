<template>
  <div id="app" @click="handleClick">
    <modal v-model="showStartModal" button="Jouer">
      <h2>Dom at Home</h2>
    </modal>
    <game></game>
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
      inGame: false,
      showStartModal: true
    }
  },
  methods:{
    gameOver(){
      console.log("game over")
    },
    openFullscreen(){
      this.$el.requestFullscreen()
    },
    handleClick(e){
      if (!this.inGame) {
        this.inGame = true
        this.requestNextFrame()
        this.popBonus()
      }
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
html,body{
  padding:0;
  margin:0;
}
#game{
  font-family: "Press Start 2P", cursive;
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