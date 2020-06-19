<template>
  <div class="modal" v-if="$attrs.value">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

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