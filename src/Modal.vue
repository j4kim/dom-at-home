<template>
  <div class="modal" v-if="value">
    <div>
      <slot></slot>
      <button @click="close">{{ button }}</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "button"],
  methods: {
    close() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="scss">
.modal {
  position: absolute;
  background-color: rgba(0,0,0,0.2);
  z-index: 1;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  >div {
    max-width: 200px;
    background-color:white;
  }
}
</style>