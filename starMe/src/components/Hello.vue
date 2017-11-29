<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>
      Internal Links:
      <a
        class="nav-links"
        href="#/tst"
        data-title="Your's test TODO list, no more"
      >
        TODO</a>
      <a
        class="nav-links"
        href="#/urls"
        data-title="Short urls."
      >
        URLS
      </a>
    </h2>
    <!--ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul-->
    <!--h2>Ecosystem</h2-->
    <!--ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul-->
  </div>
</template>

<script>
  export default {
    name: 'hello',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    display: inline-block;
    margin: 0 10px;
  }
  
  a {
    color: #42b983;
  }
  .nav-links{
    display: inline-block; /* Строчно-блочный элемент */
    position: relative; /* Относительное позиционирование */
  }
  .nav-links:hover::after {
    content: attr(data-title); /* Выводим текст */
    position: absolute; /* Абсолютное позиционирование */
    left: 0;
    right: 0;
    top: 99%; /* Положение подсказки */
    min-width: 300%;
    
    z-index: 1; /* Отображаем подсказку поверх других элементов */
    background: rgba(81, 141, 255, 0.6); /* Полупрозрачный цвет фона */
    color: #fff; /* Цвет текста */
    text-align: center; /* Выравнивание текста по центру */
    font-family: Arial, sans-serif; /* Гарнитура шрифта */
    font-size: 10px; /* Размер текста подсказки */
    padding-left: 5px;
    padding-right: 5px;
    
  }
</style>
