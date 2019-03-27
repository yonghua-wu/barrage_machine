let timing = null
// eslint-disable-next-line no-undef
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEntryFromQr: false, // 是否通过二维码进入
    msgList: [],          // 弹幕列表
    bottomDist: 0,        // 页面底部距离
    keepBottomView: true, // 保持显示底部消息
    roomNum: '',          // 当前房间号
    inputMsg: '',         // 输入的弹幕
    openSocket: false,    // 是否开启了Socket
    joinedRoom: false,    // 是否已加入房间
    inputRoomNum: ''      // 当前输入的房间号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    if (scene !== 'undefined' && scene !== undefined && scene !== null) {
      scene = scene.toUpperCase()
      console.log('房间号：', scene)
      this.setData({
        isEntryFromQr: true,
        roomNum: scene
      })
      this.socket()
      // eslint-disable-next-line no-undef
      wx.setNavigationBarTitle({
        title: '房间：' + scene
      })
    } else {
      // eslint-disable-next-line no-undef
      wx.setNavigationBarTitle({
        title: '加入房间'
      })
    }
  },
  socket: function() {
    this.setData({
      // 开启websocket
      openSocket: true,
      joinedRoom: true
    })
    let that = this
    // eslint-disable-next-line no-undef
    wx.connectSocket({
      url: 'ws://192.168.1.103:8080/chat',
      header: {
        'content-type': 'application/json'
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
  },
  toBottom() {
    this.setData({
      bottomDist: 100000
    })
  },
  scrollScreen() {
    if (this.data.keepBottomView) {
      this.setData({
        keepBottomView: false
      })
    }
  },
  screenToLower() {
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
      nickname: '22',
      room_num: this.data.roomNum,
      avatar_url: 'http'
    }
    msg = JSON.stringify(msg)
    // 判断是否已打开websocket通信
    if (this.data.openSocket) {
      // eslint-disable-next-line no-undef
      wx.sendSocketMessage({
        data: msg
      })
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