<template>
  <div id="app">
    <div class="grid">
      <dom-head class="dom-head"/>
    </div>
  </div>
</template>

<script>
import DomHead from "@/DomHead"
export default {
  components: { DomHead }
}
</script>

<style>
html,body{
  padding:0;
  margin:0;
}
.grid{
  height: 100vh; 
  width: 100vw;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  grid-template-rows: repeat(16, 1fr);

  /* adpated from https://stackoverflow.com/a/20593342/8345160 */
  height: 100vh;
  max-height: 177.78vw; /* 16/9 = 1.778 */
  width: 56.25vh; /* 9/16 = .5625  */
  max-width: 100vw;
  margin: auto;
  position: absolute;
  top:0;bottom:0; /* vertical center */
  left:0;right:0; /* horizontal center */
  
  background: lightblue;
}
.dom-head{
  grid-column: 3;
  grid-row: 5;
}
</style>