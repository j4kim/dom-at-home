<template>
  <div>
    <svg viewBox="0 0 100 50">
      <mask id="mask">
        <rect width="100" height="50" fill="black"/>
        <circle cx="50" cy="50" r="50" fill="white"/>
      </mask>
      <g mask="url(#mask)">
        <rect width="100" height="50" fill="#0003"/>
        <polygon points="50,50 100,50 100,0" fill="#f00e"/>
      </g>
      <g fill="white" :style="{
        transformOrigin: '50% 100%',
        transform: `rotate(${degrees}deg)`,
        transition: 'transform 1s'
      }">
        <circle cx="50" cy="50" r="6"/>
        <line x1="50" y1="50" x2="5" y2="50" stroke="white" />
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  computed: {
    drunkRatio() {
      let ratio = this.$store.getters.drunkLevel / this.$store.state.drunkLimits.length
      return Math.min(1, ratio)
    },
    degrees() {
      let margin = 4
      return margin + (180 - 2 * margin) * this.drunkRatio
    }
  }
}
</script>