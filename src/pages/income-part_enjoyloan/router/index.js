import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    {path: '/', redirect: '/enjoyloan.vue'},
    {
      path: '/enjoyloan.vue',
      name: 'enjoyloan.vue',
      meta: {title: '恒助手-瑞享贷'},
      component: () => import('../view/enjoyloan.vue')
    }
  ]
})
