// Enable chromereload by uncommenting this line:
import 'chromereload/devonly'
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'

import App from './options/App.vue'
import About from './options/About.vue'
import Blacklist from './options/Blacklist.vue'
import Index from './options/Index.vue'
import Store from './options/Store.vue'

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
      path: '/store',
      name: 'Store',
      component: Store
    },
    {
      path: '/blacklist',
      name: 'Blacklist',
      component: Blacklist
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
