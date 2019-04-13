<template>
  <div>
    <modal
    title="信息"
    :arrow-bottom="80"
    v-on:close="close()"
    >
      昵称：{{nickname}}
    </modal>
  </div>
</template>
<script>
import store from '../stores/store.js'
import modal from './modal.vue'
export default {
  components: {
    modal
  },
  props: {
    nickname: String
  },
  mounted: function() {
  },
  methods: {
    close: function(){
      store.commit('notShowUser')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
