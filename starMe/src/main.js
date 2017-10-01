// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Login from './components/Login'
import router from './router'
import routerLogin from './routerLogin'
import VueResource from 'vue-resource';

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';


Vue.use({
  install(V) {
    let bus = new Vue();
    V.prototype.$bus = bus;
    V.bus = bus;
  }
});
/* eslint-disable no-new */
let app = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: {App}
});

let login = new Vue({
  el: '#login',
  routerLogin,
  template: '<Login/>',
  components: {Login}
});






// const EventBus = new Vue();
// Object.defineProperties(Vue.prototype, {
//   $bus: {
//     get: function () {
//       return EventBus
//     }
//   }
// });
