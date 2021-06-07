<template>
  <div>
    <svg width="100%" viewBox="0 0 100 50">
      <mask id="mask">
        <rect width="100" height="50" fill="black"/>
        <circle cx="50" cy="50" r="50" fill="white"/>
      </mask>
      <g mask="url(#mask)">
        <rect width="100" height="50" fill="#0003"/>
        <polygon points="50,50 100,50 100,0" fill="#f00e"/>
      </g>
      <g id="hand" fill="white" :style="{
        transformOrigin: '50% 100%',
        transform: `rotate(${degrees}deg)`,
        transition: 'transform 2s'
      }">
        <g id="hand-inner" :class="`shake-${shake}`">
          <circle cx="50" cy="50" r="6"/>
          <line x1="50" y1="50" x2="10" y2="50" stroke="white" stroke-width="2" />
        </g>
      </g>
      <text x="50" y="25" fill="white" font-size="30px" dominant-baseline="middle" text-anchor="middle">%.</text>
      <text x="2" y="48" fill="white">0</text>
      <text x="98" y="48" fill="white" text-anchor="end">12</text>
    </svg>
  </div>
</template>

<script>
export default {
  computed: {
    drunkRatio() {
      return this.$store.state.drunkenness / 12
    },
    degrees() {
      let margin = 1
      return margin + (180 - 2 * margin) * this.drunkRatio
    },
    shake() {
      return this.$store.state.over ? 0 : this.$store.getters.drunkLevel
    }
  }
}
</script>

<style lang="scss">
@font-face {
  font-family: Pixels;
  src: url(../assets/Pixels.ttf);
}
svg {
  font-family: Pixels;
}

@keyframes shake-1 {
  from { transform: rotate(1deg) }
  to { transform: rotate(-1deg) }
}
@keyframes shake-2 {
  from { transform: rotate(3deg) }
  to { transform: rotate(-3deg) }
}
#hand-inner{
  transform-origin: 50% 100%;
  &.shake-1,
  &.shake-2 {
    animation: shake-1 .4s infinite alternate ease-in-out;
  }
  &.shake-3 {
    animation: shake-2 .4s infinite alternate ease-in-out;
  }
}
</style>