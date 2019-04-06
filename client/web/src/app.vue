<template>
  <div :class="isDarkTheme?'dark':'light'">
    <!-- <input type="button" value="shoot" @click="fullScreen()"> -->
    <barrage-area
    ref="barrage_area"
    :width="windowWidth"
    :height="windowHeight"
    :fontSize="textSize"></barrage-area>
    <div class="theme-text">
      <div v-show="!showQR">{{themeText}}</div>
      <div v-show="showQR">
        <p style="font-size: 26px;">扫码发弹幕</p>
        <canvas id="qr"></canvas>
      </div>
    </div>
    <transition name="tool">
      <div class="tool-area" v-show="!hideTool" @mouseenter="mouseEnter=true" @mouseleave="mouseEnter=false">
        <div class="tool">
          <div class="title">弹幕大小</div>
          <div class="ctrl">
            <input class="button" type="button" value="-" @click="textSize--">
            <div>{{textSize}}</div>
            <input class="button" type="button" value="+" @click="textSize++">
          </div>
        </div>
        <div class="tool">
          <div class="title">颜色</div>
          <div class="ctrl">
            <input class="btn-text" :class="isDarkTheme?'':'active'" type="button" value="亮色" @click="isDarkTheme = false">
            <input class="btn-text" :class="isDarkTheme?'active':''" type="button" value="暗色" @click="isDarkTheme = true">
          </div>
        </div>
        <div class="tool">
          <div class="title">主题文字</div>
          <div class="ctrl">
            <input class="input" type="text" v-model="themeText" placeholder="编辑">
          </div>
        </div>
        <div class="tool">
          <div class="title">房间信息</div>
          <div class="ctrl">
            <div>{{roomNum}} 号房间</div>
            <input class="btn-text" :class="showQR?'active':''" type="button" value="二维码" @click="showQR = !showQR">
          </div>
        </div>
        <div class="tool">
          <div class="title">屏幕</div>
          <div class="ctrl">
            <input class="btn-text" type="button" :value="ctrlScr?'退出全屏':'全屏'" @click="ctrlScr = !ctrlScr">
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import barrageArea from './components/barrage-area.vue'
import config from './config.js'
import QRcode from 'qrcode'
let webSocket
// let barr = [
//   '你好',
//   '你好你好',
//   '你好你好你好',
//   '你好你好你好你好',
//   '你好你好你好你好你好',
//   '你好你好你好你好你好你好',
//   '你好你好你好你好你好你好你好',
//   '你好你好你好你好你好你好你好你好',
//   '你好你好你好你好你好你好你好你好你好',
//   '你好你好你好你好你好你好你好你好你好你好',
// ]
export default {
  components: {
    'barrage-area': barrageArea
  },
  data: function() {
    return {
      roomNum: '--',      // 房间号
      textSize: 30,       // 弹幕字体大小
      isDarkTheme: true,  // 是否使用暗色主题
      screenChange: 1,    // 监听屏幕大小改变
      themeText: '',      // 主题文字
      showQR: false,      // 是否展示二维码
      hideTool: false,    // 是否隐藏tool区
      mouseEnter: false,  // 鼠标是否在tool区
      ctrlScr: false      // 控制屏幕是否全屏
    }
  },
  mounted: function() {
    this.$http.get('/room').then(res => {
      if (res.data.status === 0) {
        this.socketInit()
        this.roomNum = res.data.result.room_num.toString()
        this.createQr()
      }
    })
    // addEventListener('keydown', (e) => {
    //   console.log(e.code)
    //   if(e.code == 'Escape') {
    //     this.exitScreen()
    //   }
    // })
    let that = this
    // 监听窗口大小改变
    window.onresize = function(){
      that.screenChange++
      that.ctrlScr = that.checkFull()
    }
    window.lastMove = new Date().getTime()
    // 监听鼠标移动
    document.onmousemove = function() {
      window.lastMove = new Date().getTime()
      that.hideTool = false
    }
    // 当鼠标不动超过2秒，并且鼠标不在tool区时，隐藏tool区
    window.setInterval(function() {
      if(that.mouseEnter || that.hideTool) return
      var now = new Date().getTime()
      if(now - window.lastMove > 2000) {
        that.hideTool = true
      }
    }, 1000)
  },
  computed: {
    windowWidth: function () {
      if(this.screenChange);
      return window.innerWidth
    },
    windowHeight: function() {
      if(this.screenChange);
      return window.innerHeight
    }
  },
  watch: {
    textSize: function() {
      if(this.textSize > 50) {
        this.textSize = 50
      }
      if(this.textSize < 12) {
        this.textSize = 12
      }
    },
    isDarkTheme: function() {
      this.createQr()
    },
    ctrlScr: function() {
      if (this.ctrlScr) {
        this.fullScreen()
      } else {
        this.exitFullScreen()
      }
    }
  },
  methods: {
    socketInit: function() {
      let that = this
      /* 封装 WebSocket 实例化的方法  */
      var CreateWebSocket = (function () {
        return function (urlValue) {
          if(window.WebSocket) return new WebSocket(urlValue)
          return false
        }
      })()
      /* 实例化 WebSocket 连接对象, 地址为 ws 协议 */
      webSocket = CreateWebSocket(config.websocket)
      /* 接收到服务端的消息时 */
      webSocket.onmessage = function (msg) {
        msg = JSON.parse(msg.data)
        if(!msg.room_num || msg.room_num != that.roomNum) {
          return 
        }
        // 发送这条弹幕
        that.shootMsg(msg)
      }
      /* 关闭时 */
      webSocket.onclose = function () {
        console.log('关闭连接')
      }
    },
    shootMsg: function(msg) {
      // 发送弹幕
      this.$refs.barrage_area.shoot(msg.text)
      // setInterval(() => {
      //   this.$refs.barrageArea.shoot(barr[parseInt(Math.random()*10)])
      // }, 100)
    },
    // 全屏
    fullScreen: function(){
      var el = document.documentElement
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen      
      if(typeof rfs != 'undefined' && rfs) {
        rfs.call(el)
      }
      return
    },
    // 退出全屏
    exitFullScreen: function() {
      var el = document
      var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
          el.mozCancelFullScreen || el.exitFullScreen
      if (cfs) { //typeof cfs != "undefined" && cfs
        cfs.call(el)
      }
    },
    // 检查屏幕是否全屏
    checkFull: function() {
      return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen
    },
    // 生成二维码
    createQr: function() {
      let qr = document.getElementById('qr')
      let val = config.host + '?room=' + this.roomNum
      QRcode.toCanvas(qr, val, {
        margin: 4,
        width: 360,
        color: {
          light: '#ffffff00',
          dark: this.isDarkTheme ? '#ffffffff' : '#000000ff'
        }
      })
    }
  }
}
</script>
<style lang="scss">
body,h1,h2,h3,h4,h5,h6,hr,p,blockquote,dl,dt,dd,ul,ol,li,pre,form,fieldset,legend,button,input,textarea,th,td{margin:0;padding:0;}
h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal;}
address,cite,dfn,em,var{font-style:normal;}
code,kbd,pre,samp{font-family:couriernew,courier,monospace;}
small{font-size:12px;}
ul,ol{list-style:none;}
a{text-decoration:none;}
a:hover{text-decoration:underline;}
sup{vertical-align:text-top;}
sub{vertical-align:text-bottom;}
legend{color:#000;}
fieldset,img{border:0;}
button,input,select,textarea{font-size:100%;}
table{border-collapse:collapse;border-spacing:0;}
article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section,
summary,time,mark,audio,video{display:block;margin:0;padding:0;}
mark{background:#ff0;}
body {
  overflow-x: hidden;
}
#myvideo:-webkit-full-screen {
  width: 100%;
  height: 100%;
}
.dark {
  background-color: #282c34;
  color: #fafafa;
}
.light {
  background-color: #e0e0e0;
  color: #333;
}
.theme-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  font-size: 40px;
  opacity: 0.4;
  #qr {
    width: 400px;
    height: 400px;
  }
}
.tool-area {
  display: flex;
  flex-direction: row;
  position: absolute;
  box-sizing: border-box;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  height: 90px;
  border-radius: 15px;
  background-color: rgba(209, 209, 209, 0.8);
  color: #333;
  &:hover {
    background-color: rgba(209, 209, 209, 0.9);
    box-shadow: 0px 0px 10px rgba(226, 226, 226, 0.5);
  }
  .tool {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 200px;
    border-right: 1px solid #282c34;
    height: 100%;
    font-size: 14px;
    &:last-child {
      border: 0;
    }
    .ctrl {
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      flex: 1;
      width: 100%;
      padding: 5px;
      .button {
        width: 30px;
        height: 30px;
        background-color: #ffffff00;
        border: 0;
        border: 1px solid #888;
        border-radius: 8px;
        color: #333;
        cursor: pointer;
        &:focus {
          outline: unset;
        }
        &:active {
          border: 1px solid #000;
        }
      }
      .btn-text {
        height: 30px;
        padding: 0 10px;
        background-color: #ffffff00;
        border: 0;
        border: 1px solid #888;
        border-radius: 8px;
        color: #333;
        cursor: pointer;
        &:focus {
          outline: unset;
        }
        &:active {
          border: 1px solid #000;
        }
      }
      .active {
        background-color: #333;
        color: #ccc;
      }
      .input {
        box-sizing: border-box;
        height: 30px;
        width: 140px;
        border-radius: 8px;
        border: 1px solid #888;
        background-color: rgba($color: #000000, $alpha: 0);
        padding: 5px;
        &:focus {
          outline: unset;
        }
      }
    }
  }
}
.tool-enter-active, .tool-leave-active {
  transition: opacity .5s;
}
.tool-enter, .tool-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
barrage-area {
  position: absolute;
}
</style>
