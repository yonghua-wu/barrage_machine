<template>
  <div>
    <modal
    title="快分享给朋友吧"
    :arrow-bottom="15"
    v-on:close="close()"
    >
      <canvas id="qr"></canvas>
    </modal>
  </div>
</template>
<script>
import modal from './modal.vue'
import store from '../stores/store.js'
import config from '../config.js'
import QRcode from 'qrcode'
export default {
  components: {
    modal
  },
  props: {
    roomNum: String
  },
  mounted: function() {
    this.createQr()
  },
  methods: {
    createQr: function() {
      let qr = document.getElementById('qr')
      let width = qr.parentNode.clientWidth - 20
      let val = config.mobileHost + '?room=' + this.roomNum
      QRcode.toCanvas(qr, val, {
        margin: 2,
        width: width,
        color: {
          light: '#ffffff00',
          dark: this.isDarkTheme ? '#ffffffff' : '#000000ff'
        }
      })
    },
    close: function() {
      store.commit('notShowRoom')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
