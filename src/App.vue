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
  grid-template-columns: repeat(9, auto);
  grid-template-rows: repeat(16, auto);
}
.dom-head{
  grid-column: 3;
  grid-row: 5;
}
</style>