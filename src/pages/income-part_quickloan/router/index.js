import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/quickloan.vue' },
    {
      path: '/quickloan.vue',
      name: 'quickloan.vue',
      meta: { title: '恒助手-恒速贷' },
      component: () => import('../view/quickloan.vue')
    }
  ]
})
