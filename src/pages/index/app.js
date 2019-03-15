/*import Vue from 'vue'
import App from './app.vue'
import router from './router'
import '@/styles/index.css'
import global from 'common/global'
import VcToast from '@/components/toast'

import myAxios from '@/common/myAxios/index';
import apiFunc from '@/common/myAxios/axios.func'
Vue.prototype.$axios=myAxios;
Vue.prototype.apiFunc=apiFunc;
Vue.use(VcToast)
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})*/
import router from './router'
import Vue from 'vue'
import App from './../../model/app.js';
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
