<template>
  <div class="page">
    <div class="barrage-list" id="list" @scroll="scrollEvent">
      <div class="item" v-for="(item, index) in barrageList" :key="index">
        <div class="nickname">{{item.nickname}}：</div>
        <div class="barrage">{{item.text}}</div>
      </div>
    </div>
    <div class="room-info" @click="clickRoom()">
      <div class="num">1</div>
      <div class="text">房间</div>
    </div>
    <div class="user-info" @click="clickUser()">
      <img src="../images/user.png" alt="">
    </div>
    <div class="input-group flex-row flex-y-center">
      <input class="input flex-main" type="text" name="" id="" v-model="inputText">
      <input class="button" type="button" value="发送" @click="sendMsg()">
    </div>
    <transition name="fade">
      <user v-if="showUser" nickname="昵称"></user>
      <room v-if="showRoom" :room-num="roomNum"></room>
    </transition>
    
  </div>
</template>
<script>
import config from '../config.js'
import room from '../components/room.vue'
import user from '../components/user.vue'
import store from '../stores/store.js'
import { mapState } from 'vuex'

let keepBottom = true
let webSocket
export default {
  components: {
    room,
    user
  },
  data: function() {
    return {
      barrageList: [],
      roomNum: '1',
      inputText: '',
      nickname: '昵称'
    }
  },
  mounted: function() {
    this.webSocketInit()
  },
  computed: {
    ...mapState([
      'showUser',
      'showRoom'
    ])
  },
  methods: {
    webSocketInit: function() {
      let that = this
      webSocket = new WebSocket(config.websocket)
      webSocket.onmessage = function(msg) {
        msg = JSON.parse(msg.data)
        if(!msg.room_num || msg.room_num != that.roomNum) {
          return 
        }
        // 发送这条弹幕
        that.shootMsg(msg)
      }
    },
    shootMsg: function (msg) {
      this.barrageList.push(msg)
      if(this.barrageList.lenght > 200) {
        this.barrageList.splice(0, 30)
      }
      this.toBottom()
    },
    scrollEvent: function (e) {
      // console.log(e.srcElement.scrollTop + e.srcElement.offsetHeight, e.srcElement.scrollHeight)
      if (e.srcElement.scrollTop + e.srcElement.offsetHeight >= e.srcElement.scrollHeight - 10) {
        // console.log(true)
        keepBottom = true
      } else {
        // console.log(false)
        keepBottom = false
      }
    },
    sendMsg: function() {
      if (this.inputText == '') return
      let msg = {
        text: this.inputText,
        nickname: this.nickname,
        room_num: this.roomNum,
        avatar_url: ''
      }
      msg = JSON.stringify(msg)
      if (webSocket) {
        webSocket.send(msg)
      }
      this.inputText = ''
    },
    clickRoom: function() {
      if (this.showRoom) {
        store.commit('notShowRoom')
      } else {
        store.commit('isShowRoom')
      }
    },
    clickUser: function() {
      if (this.showUser) {
        store.commit('notShowUser')
      } else {
        store.commit('isShowUser')
      }
    },
    toBottom: function() {
      if (keepBottom) {
        setTimeout(() => {
          let list = document.getElementById('list')
          list.scrollTop = list.scrollHeight
        }, 10)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
* {
  box-sizing: border-box;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.page {
  position: relative;
  height: 100vh;
  width: 100vw;
  background-color: #f8f8f8;
  .barrage-list {
    box-sizing: border-box;
    position: fixed;
    overflow-y: auto; 
    height: calc(100% - 50px);
    width: 100%;
    padding: 10px 15px;
    .item {
      padding: 2px 0px;
      width: 100%;
      .nickname {
        float: left;
        color: #888;
      }
      .text {
        float: left;
        color: #333;
      }
    }
  }
  .room-info {
    box-sizing: border-box;
    position: fixed;
    bottom: 65px;
    right: 15px;
    background-color: #fff;
    height: 50px;
    width: 50px;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    border-radius: 10px;
    padding: 5px;
    .num {
      text-align: center;
      // font-size: 18px;
      color: #333;
      height: 24px;
      line-height: 25px;
    }
    .text {
      // display: inline;
      font-size: 12px;
      color: #bbb;
      height: 25px;
      line-height: 20px;
      border-top: 1px solid #eee;
      width: 30px;
      text-align: center;
      margin: 0 auto;
    }
  }
  .user-info {
    position: fixed;
    right: 15px;
    bottom: 130px;
    height: 50px;
    width: 50px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    text-align: center;
    img {
      margin-top: 12px;
      width: 25px;
      height: 25px;
      border-radius: 6px;
    }
  }
  .input-group {
    box-sizing: border-box;
    position: fixed;
    bottom: 0px;
    height: 50px;
    width: 100%;
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0,0,0,0.1);
    padding: 0px 15px;
    .input {
      border: 0px;
      background-color: #f5f5f5;
      height: 35px;
      border-radius: 10px;
      padding: 0px 10px;
    }
    .button {
      border: 0px;
      height: 35px;
      background-color: #f2f2f2;
      padding: 0px 9px;
      border-radius: 10px;
      margin-left: 10px;
      &:active {
        background-color: #ccc;
      }
    }
  }
}
input:focus {
  outline: 0px;
}
</style>

