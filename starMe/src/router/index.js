import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Tst from '@/components/Tst'
import OrbitaTest from '@/components/OrbitaTest'
import UrlShort from '@/components/UrlShort'



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
    {
      path: '/OrbitaTest',
      name: 'OrbitaTest',
      component: OrbitaTest
    },
  ]
})
