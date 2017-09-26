// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './Login'
import router from './router'

Vue.config.productionTip = false;

/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});

let login = new Vue({
  el: '#login',
  router,
  template: '<Login/>',
  components: { Login }
});
