import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/entrepreneur' },
    {
      path: '/entrepreneur',
      name: 'entrepreneur',
      meta: { title: '恒助手-企业信息' },
      component: () => import('../view/entrepreneur')
    }
  ]
})
