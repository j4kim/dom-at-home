<template>
  <div id="app" v-fuzz="$store">
    <modal
      v-if="$store.state.startModalShown"
      :button="$store.getters.startButtonContent"
      title="Dom at Home"
      @click="$store.dispatch('startCountdown')"
      :disabled="!$store.getters.canStart"
    >
      <p>
        Le Locle, été 2021&nbsp;: Pas de fête du Crêt-Vaillant cette année&nbsp;! 😢
        Du coup, Domingos – la mascotte du Camping Vaillant – reste chez lui et bois des pastis...
        Et plus il boit, plus sa barbe pousse, oui c'est étrange.
        Vous l'aurez compris, le but du jeu est de boire le plus de pastis
        possible, sans manger sa barbe.
      </p>
      <p :style="{ fontWeight: 600, textAlign: 'center' }">
        Crédits: {{ $store.state.credits }}
      </p>
      <p :style="{ textAlign: 'center', fontStyle: 'italic', fontSize: '.8em' }">
        Meilleur score: {{ $store.state.bestScore }}
      </p>
    </modal>
    <modal
      v-if="$store.state.bestScoreModalShown"
      title="Bravo !"
      button="A: Imprimer le bon"
    >
      <p>Nouveau meilleur score: {{ $store.state.score }}</p>
      <p>Félicitations, vous gagnez un bon boisson !</p>
    </modal>
    <game>
    </game>
    <div
      class="fireworks-container"
      :style="{
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        position: 'absolute'
      }"
    />
  </div>
</template>

<script>
import Modal from "@/Modal"
import Game from "@/Game"

export default {
  components: { Game, Modal },
  methods:{
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
.arcade-font{
  font-family: "Press Start 2P", sans-serif;
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
  background-size: auto 100vh;
  image-rendering: pixelated;
  background-position-x: center;
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