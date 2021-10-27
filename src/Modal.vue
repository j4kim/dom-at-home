<template>
  <div class="modal" v-if="value">
    <div class="box">
      <div class="inner">
        <h2 class="arcade-font">{{ title }}</h2>
        <div class="content"><slot></slot></div>
        <button
          class="arcade-font"
          @click="$emit('click')"
          :disabled="disabled"
          v-text="button"  
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["value", "title", "button", "disabled"]
}
</script>

<style lang="scss">
.modal {
  position: absolute;
  background-color: rgba(0,0,0,0.4);
  z-index: 10;
  height: 100vh;
  height: -webkit-fill-available;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  >div.box {
    padding: 1rem;
    max-width: 95vw;
    max-height: 95vh;
    background-color:white;
    box-sizing: border-box;
    display: flex;
    >div.inner {
      max-width: 300px;
      display: flex;
      flex-direction: column;
      max-height: 100%;
      h2{
        margin: 10px 0 0 0;
        text-align: center;
      }
      .content{
        overflow: auto;
      }
      button {
        font-size: 1.2rem;
        padding: 20px;
        width: 100%;
        border: none;
        background-color: lightcoral;
      }
    }
  }
}
</style>