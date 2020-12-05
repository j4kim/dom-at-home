<template>
  <div :style="{
    background: '#2a1e1b',
    gridColumn: x, gridRow: y
  }" />
</template>

<script>
export default {
  props: ["x", "y"]
}
</script>