<template>
  <div :style="{
    gridColumn: x, gridRow: y
  }" />
</template>

<script>
export default {
  props: ["x", "y"]
}
</script>