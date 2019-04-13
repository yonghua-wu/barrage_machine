<template>
  <div class="auth">
    <div class="input-group flex-row flex-y-center">
      <span class="input-title">房间号</span>
      <input class="input flex-main" type="text" name="" id="" placeholder="输入房间号" v-model="roomNum" :disabled="isNotEdit">
    </div>
    <div class="input-group flex-row flex-y-center">
      <span class="input-title flex-row"><span>昵</span><span>称</span></span>
      <input class="input flex-main" type="text" name="" id="" placeholder="你的昵称" v-model="nickname" :disabled="isNotEdit">
    </div>
    <div class="input-group flex-row flex-y-center">
      <span class="input-title">验证码</span>
      <input class="input flex-main" type="text" name="" id="" placeholder="输入验证码" v-model="pin">
      <img class="input-pin" :src="imgSrc" alt="" @click="refreshPin()">
    </div>
    <div class="input-group flex-row flex-x-between flex-y-center">
      <span class="msg red">{{serverMsg}}</span>
      <input class="enter-button" type="button" value="进入" @click="submit()">
    </div>
  </div>
</template>
<script>
import config from '../config.js'
import store from '../stores/store.js'
let rand
export default {
  data: function() {
    return {
      imgSrc: '',
      roomNum: '',
      nickname: '',
      pin: '',
      isNotEdit: false,
      serverMsg: ''
    }
  },
  mounted: function() {
    this.createPin()
    let info = localStorage.getItem('logged')
    if (info) {
      info = JSON.parse(info)
      this.roomNum = info.roomNum
      this.nickname = info.nickname
      this.isNotEdit = true
    } else {
      this.roomNum = this.$route.query.room || ''
    }
  },
  methods: {
    createPin: function() {
      rand = Math.random().toString()
      this.imgSrc = config.host + '/img?rand=' + rand
    },
    refreshPin: function() {
      this.createPin()
    },
    submit: function() {
      if(this.roomNum && this.nickname && this.pin) {
        this.$http.post('/login_room', {
          roomNum: this.roomNum,
          nickname: this.nickname,
          pin: this.pin,
          rand: rand,
          notNewUser: this.isNotEdit
        }).then(req => {
          console.log(req)
          store.commit('setRoomNum', this.roomNum)
          store.commit('setNickname', this.nickname)
          if (req.data.status == 0) {
            localStorage.setItem('logged', JSON.stringify({
              nickname: this.nickname,
              roomNum: this.roomNum
            }))
            this.$router.push('index')
          } else {
            this.isNotEdit = false
            this.serverMsg = req.data.msg
            localStorage.removeItem('logged')
          }
        }).catch(req => {
          console.log(req)
        })
      } else {
        this.serverMsg = '信息填写不完整'
        console.log('信息不完整')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.auth {
  margin-top: 22vh;
  padding: 20px;
  .input-group {
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #eee;
    &:last-child {
      border-bottom: 0px;
    }
    .input {
      width: 100px;
      background-color: rgba(0,0,0,0);
      
    }
    .input-title {
      padding: 0px 20px;
      width: 50px;
      flex-shrink: 0;
      justify-content: space-between;
    }
    .input-pin {
      width: 100px;
      height: 35px;
      flex-basis: 100px;
    }
    .enter-button {
      width: 100px;
      height: 35px;
    }
    .msg {
      color: #db2a2a;
      padding-left: 20px;
    }
  }
}
input {
  border: 0px;
  &:focus {
    outline: 0px;
  }
}
</style>
