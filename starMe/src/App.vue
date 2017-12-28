<template>
  
  
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }


</script>

<style>
  #app {
    position: absolute;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 2px;
    left: 2px;
    right: 2px;
    top: 2px;
    height: calc(90% - 60px);
    background-color: #bdbdbd;
    overflow: scroll;
  }
  
  .btn-icon {
    font-size: 24px;
    width: 1em;
  }
  
  .md-button.btn-icon {
    padding: 0;
  }


</style>
