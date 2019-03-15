import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    // { path: '*', redirect: '/404' },
    // { path: '/404', component: () => import('@/views/error-page/404') },
    { path: '/', redirect: '/addcontact' },
    {
      path: '/addcontact',
      name: 'addcontact',
      meta: { title: '恒助手-添加联系人信息' },
      component: () => import('../view/addcontact')
    }
  ]
})
