const tips = require('../../utils/tips.js')
const config = require('../../utils/config.js')
let timing = null
// eslint-disable-next-line no-undef
Page({
  data: {
    userInfo: null,
    isEntryFromQr: false, // 是否通过二维码进入
    msgList: [],          // 弹幕列表
    bottomDist: 0,        // 页面底部距离
    keepBottomView: true, // 保持显示底部消息
    roomNum: '',          // 当前房间号
    inputMsg: '',         // 输入的弹幕
    openSocket: false,    // 是否开启了Socket
    inputRoomNum: ''      // 当前输入的房间号
  },
  onLoad: function (query) {
    tips.showLoading()
    console.log(query.room)
    this.setData({
      isEntryFromQr: true,
      roomNum: query.room,
      // eslint-disable-next-line no-undef
      userInfo: wx.getStorageSync('userInfo')
    })
    // eslint-disable-next-line no-undef
    wx.setNavigationBarTitle({
      title: '房间：' + query.room
    })
  },
  onShow: function() {
    if (!this.data.openSocket) {
      this.socket()
    }
  },
  onUnload: function () {
    // eslint-disable-next-line no-undef
    wx.closeSocket()
  },
  socket: function() {
    this.setData({
      // 开启websocket
      openSocket: true
    })
    let that = this
    // eslint-disable-next-line no-undef
    wx.connectSocket({
      url: config.URL.wsUrl,
      header: {
        'content-type': 'application/json'
      },
      success: function () {
        tips.showToast('success', '已进入房间')
      },
      fail: function() {
        tips.showToast('fail', '连接失败')
      }
    })
    // eslint-disable-next-line no-undef
    wx.onSocketMessage(function (msg) {
      if (!msg.data) {
        return
      }
      msg = JSON.parse(msg.data)
      console.log(msg)
      if (msg.room_num !== that.data.roomNum) {
        return
      }
      let list = that.data.msgList
      list.push(msg)
      // 如果消息数大于200个，删除前面30个
      if (list.length > 200) {
        list.splice(0,30)
      }
      that.setData({
        msgList: list
      })
      if (that.data.keepBottomView) {
        that.toBottom()
      }
    })
    // eslint-disable-next-line no-undef
    wx.onSocketClose(() => {
      this.setData({
        openSocket: false
      })
    })
  },
  toBottom() {
    this.setData({
      bottomDist: 100000
    })
  },
  scrollScreen() {  //监听屏幕滑动事件，当屏幕滑动时，取消自动滚动
    if (this.data.keepBottomView) {
      this.setData({
        keepBottomView: false
      })
    }
  },
  screenToLower() { //屏幕滑动到最底端时，设置自动滚动
    let that = this
    if (timing) {
      clearTimeout(timing)
      timing = null
    }
    timing = setTimeout(() => {
      that.setData({
        keepBottomView: true
      })
      that.toBottom()
    }, 800)
  },
  bindMsgText(e) {
    this.setData({
      inputMsg: e.detail.value
    })
  },
  sendMsg() {
    console.log(this.data.inputMsg)
    if (this.data.inputMsg == '') return
    let msg = {
      text: this.data.inputMsg,
      nickname: this.data.userInfo.nickName,
      room_num: this.data.roomNum,
      avatar_url: this.data.userInfo.avatarUrl
    }
    msg = JSON.stringify(msg)
    // 判断是否已打开websocket通信
    if (this.data.openSocket) {
      // eslint-disable-next-line no-undef
      for(let i=0; i<10; i++) {
        wx.sendSocketMessage({
          data: msg
        })
      }
    }
    this.setData({
      inputMsg: ''
    })
  },
  joinRoom() {
    this.socket()
    this.setData({
      roomNum: this.data.inputRoomNum
    })
    // eslint-disable-next-line no-undef
    wx.setNavigationBarTitle({
      title: '房间：' + this.data.inputRoomNum
    })
  },
  bindRoomNum(e) {
    this.setData({
      inputRoomNum: e.detail.value.toUpperCase()
    })
  }
})