<template>
  <div id="game" ref="game">
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
        <div class="replay-button">
          <button
            class="arcade-font"
            v-if="$store.state.over"
            @click="$store.dispatch('restart')"
          >
            Rejouer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'lodash.product'
import SwipeListener from 'swipe-listener'

import AlcoholMeter from "@/components/AlcoholMeter"

import DomHead from "@/objects/DomHead"
import DomBeard from "@/objects/DomBeard"
import Bonus from "@/objects/Bonus"

export default {
  components: { DomHead, DomBeard, Bonus, AlcoholMeter },
  mounted(){
    SwipeListener(this.$refs.grid, {
      preventScroll: true,
      deltaHorizontal: 1,
      deltaVertical: 1
    })
    this.$refs.grid.addEventListener("swipe", e => {
      this.$store.dispatch('changeDirection', e.detail.directions)
    })
    document.addEventListener("keydown", e => {
      if (e.code.startsWith('Arrow')) {
        // 'ArrowLeft' --> 'left', 'ArrowUp' --> 'top'
        let dir = e.code
          .substring(5)
          .toLowerCase()
          .replace('up', 'top')
          .replace('down', 'bottom')
        this.$store.dispatch('changeDirection', { [dir]: true })
        e.preventDefault()
      }
    })
  },
}
</script>