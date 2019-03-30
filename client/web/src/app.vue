<template>
  <div>
    <input type="button" value="发送" @click="sendMsg">
    <barrage-area
    :width="500"
    :height="500"
    :fontSize="20"></barrage-area>
  </div>
</template>
<script>
import barrageArea from './components/barrage-area.vue'
let webSocket
export default {
  components: {
    'barrage-area': barrageArea
  },
  data: function() {
    return {
      barrageList: [],
      barrageIsShow: true,
      barrageLoop: false
    }
  },
  mounted: function() {
    console.log(window)
    this.$http.get('/room').then(res => {
      console.log(res.data)
      if (res.data.status === 0) {
        this.socketInit()
      }
    })
  },
  methods: {
    socketInit: function() {
      /* 封装 WebSocket 实例化的方法  */
      var CreateWebSocket = (function () {
        return function (urlValue) {
          if(window.WebSocket) return new WebSocket(urlValue)
          return false
        }
      })()
      /* 实例化 WebSocket 连接对象, 地址为 ws 协议 */
      webSocket = CreateWebSocket('wss://woxiangchixingxing.com/ws/chat')
      /* 接收到服务端的消息时 */
      webSocket.onmessage = function (msg) {
        console.log('服务端说:' + msg.data)
      }
      /* 关闭时 */
      webSocket.onclose = function () {
        console.log('关闭连接')
      }
    },
    sendMsg: function() {
      
    }
  }
}
</script>
