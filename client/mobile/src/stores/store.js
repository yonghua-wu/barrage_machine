import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    showRoom: false,
    showUser: false,
  },
  mutations: {
    notShowRoom: state => {
      state.showRoom = false
    },
    notShowUser: state => {
      state.showUser = false
    },
    isShowRoom: state => {
      state.showRoom = true
      state.showUser = false
    },
    isShowUser: state => {
      state.showUser = true
      state.showRoom = false
    }
  }
})