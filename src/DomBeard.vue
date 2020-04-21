<template>
  <div :style="{
    background: '#33221c',
    gridColumn: x, gridRow: y
  }" />
</template>

<script>
export default {
  props: ["x", "y"]
}
</script>