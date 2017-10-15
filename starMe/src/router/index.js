import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tst from '@/components/Tst'
import UrlShort from '@/components/UrlShort'
import Go from 'gojs'


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
    {
      path: '/urls',
      name: 'UrlShort',
      component: UrlShort
    },
  ]
})
