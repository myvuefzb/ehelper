import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/flashloan.vue' },
    {
      path: '/flashloan.vue',
      name: 'flashloan.vue',
      meta: { title: '恒助手-闪电贷' },
      component: () => import('../view/flashloan.vue')
    }
  ]
})
