import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tst from '@/components/Tst'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/tst',
      name: 'Tst',
      component: Tst
    },
  ]
})
