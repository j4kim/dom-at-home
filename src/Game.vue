<template>
  <div id="game" ref="game" v-sway="$store">
    <div id="score-container">
      <div id="score" class="arcade-font">
        {{ $store.state.score }}
      </div>
    </div>
    <div id="grid-container">
      <div id="grid" ref="grid" :style="{
        gridTemplateColumns: `repeat(${$store.state.grid.columns}, 1fr)`,
        gridTemplateRows: `repeat(${$store.state.grid.rows}, 1fr)`
      }">
        <component
          v-for="o in $store.getters.objects"
          :is="o.component"
          :key="o.id"
          v-bind="o"
        >
        </component>
        <slot></slot>
      </div>
      <div id="house-bottom">
        <alcohol-meter class="alcohol-meter"/>
        <div
          class="game-over arcade-font"
          v-show="$store.state.over"
        >
          Game<br>Over!
        </div>
        <div class="replay-or-volume-button">
          <button
            class="arcade-font"
            v-if="$store.state.over"
            @click="$store.dispatch('restart')"
          >
            Rejouer
          </button>
          <volume-icon v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'lodash.product'
import Hammer from 'hammerjs'

import AlcoholMeter from "@/components/AlcoholMeter"
import VolumeIcon from "@/components/VolumeIcon"

import DomHead from "@/objects/DomHead"
import DomBeard from "@/objects/DomBeard"
import Bonus from "@/objects/Bonus"

export default {
  components: { DomHead, DomBeard, Bonus, AlcoholMeter, VolumeIcon },
  mounted(){
    let mc = Hammer(this.$refs.grid)
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    ['left', 'up', 'right', 'down'].forEach(dir => {
      mc.on(`swipe${dir}`, () => { this.changeDir(dir) })
    })
    document.addEventListener("keydown", e => {
      if (e.code.startsWith('Arrow')) {
        // 'ArrowLeft' --> 'left'
        let dir = e.code.substring(5).toLowerCase()
        this.changeDir(dir)
        e.preventDefault()
      } else if (e.code === 'KeyC') {
        this.$store.commit("addCredit")
      }
    })
  },
  methods: {
    changeDir (dir) {
      this.$store.dispatch('changeDirection', dir)
    }
  },
  watch: {
    "$store.state.over": function () {
      this.$refs.game.style.transform = 'rotate(0deg)'
    }
  }
}
</script>

<style lang="scss">
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
          &.replay-or-volume-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>