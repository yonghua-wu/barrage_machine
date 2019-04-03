<template>
  <div :class="isDarkTheme?'dark':'light'">
    <!-- <input type="button" value="shoot" @click="fullScreen()"> -->
    <barrage-area
    ref="barrage_area"
    :width="windowWidth"
    :height="windowHeight"
    :fontSize="textSize"></barrage-area>
    <div class="tool-area">
      <div class="tool">
        <div class="title">字体大小</div>
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
          <input class="input" type="text">
          <input class="input-btn"  type="button" value="确定" >
        </div>
      </div>
      <div class="tool">
        <div class="title">房间编号</div>
        <div class="ctrl">
          <div>{{roomNum}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import barrageArea from './components/barrage-area.vue'
import config from './config.js'
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
      barrageList: [],
      barrageIsShow: true,
      barrageLoop: false,
      roomNum: '--',
      textSize: 26,
      isDarkTheme: true,
      screenChange: 1
    }
  },
  mounted: function() {
    this.$http.get('/room').then(res => {
      if (res.data.status === 0) {
        this.socketInit()
        this.roomNum = res.data.result.room_num.toString()
      }
    })
    // addEventListener('keydown', (e) => {
    //   console.log(e.code)
    //   if(e.code == 'Escape') {
    //     this.exitScreen()
    //   }
    // })
    let that = this
    window.onresize = function(){
      that.screenChange++
    }
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
        that.shootMsg(msg)
      }
      /* 关闭时 */
      webSocket.onclose = function () {
        console.log('关闭连接')
      }
    },
    shootMsg: function(msg) {
      this.$refs.barrage_area.shoot(msg.text)
      // setInterval(() => {
      //   this.$refs.barrageArea.shoot(barr[parseInt(Math.random()*10)])
      // }, 100)
    },
    fullScreen: function(){
      var el = document.documentElement
      var rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen      
      if(typeof rfs != 'undefined' && rfs) {
        rfs.call(el)
      }
      return
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
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
        border: 1px solid #888;
        border-right: 0px;
        background-color: rgba($color: #000000, $alpha: 0);
        padding: 5px;
        &:focus {
          outline: unset;
        }
      }
      .input-btn {
        height: 30px;
        padding: 0 10px;
        background-color: #ffffff00;
        border: 1px solid #888;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
        color: #333;
        cursor: pointer;
        &:focus {
          outline: unset;
        }
        &:active {
          border: 1px solid #000;
        }
      }
    }
  }
}
barrage-area {
  position: absolute;
}
</style>
