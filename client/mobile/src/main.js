import Vue from 'vue'
import App from './app.vue'
import store from './stores/store.js'
import axios from 'axios'
import config from './config.js'
import router from './router.js'

Vue.prototype.$http = axios.create({
  baseURL: config.host,
  timeout: 10000
})

router.beforeEach((to, from, next) => {
  console.log(to)
  console.log(from)
  if (to.path == '/index' && (!store.state.roomNum || !store.state.nickname)) {
    next('/')
  } else {
    next()
  }
})

new Vue({
  store,
  router,
  el: '#root',
  render: h => h(App)
})