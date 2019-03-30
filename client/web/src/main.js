import Vue from 'vue'
import App from './app.vue'
import store from './stores/store.js'
import axios from 'axios'
import config from './config.js'
Vue.prototype.$http = axios.create({
  baseURL: config.host,
  timeout: 10000
})

new Vue({
  store,
  el: '#root',
  render: h => h(App)
})