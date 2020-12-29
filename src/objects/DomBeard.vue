<template>
  <div :style="{
    background: '#2a1e1b',
    gridColumn: pos[0], gridRow: pos[1]
  }" />
</template>

<script>
export default {
  props: ["pos"]
}
</script>