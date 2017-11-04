// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import App from './options/App.vue'
import About from './options/About.vue'
import Blocklist from './options/Blocklist.vue'
import FormData from './options/FormData.vue'
import Index from './options/Index.vue'

Vue.use(BootstrapVue)
Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/form-data',
      name: 'FormData',
      component: FormData
    },
    {
      path: '/blocklist',
      name: 'Blocklist',
      component: Blocklist
    },
    {
      path: '/about',
      name: 'About',
      component: About
    }
  ]
})

new Vue({
  el: '#app',
  router,
  render(h) {
    return h('App')
  },
  components: { App }
})
