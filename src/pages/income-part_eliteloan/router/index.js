import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/eliteloan.vue' },
    {
      path: '/eliteloan.vue',
      name: 'eliteloan.vue',
      meta: { title: '恒助手-菁英贷' },
      component: () => import('../view/eliteloan.vue')
    }
  ]
})
