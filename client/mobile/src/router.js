import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from './views/auth.vue'
import index from './views/index.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '',
      component: auth
    },
    {
      path: '/index',
      component: index
    }
  ]
})