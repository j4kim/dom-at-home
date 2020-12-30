<template>
  <div>
    <div :style="{
      backgroundColor: '#fff4',
    }">
      <div :style="{
        width: `${percents}%`,
        maxWidth: '100%',
        minWidth: '2px',
        height: '20px',
        backgroundColor: 'blue',
      }"/>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    percents() {
      return 100 * this.$store.getters.drunkLevel / this.$store.state.drunkLimits.length
    }
  }
}
</script>