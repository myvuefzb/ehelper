import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/index' },
    {
      path: '/index',
      name: 'index',
      meta: { title: '恒助手-工作单位信息' },
      component: () => import('../view/index')
    }
  ]
})
