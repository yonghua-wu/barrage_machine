let timing = null
let clearTolowerfunc = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEntryFromQr: false,
    msgList: [],
    bottomDist: 0,
    keepBottomView: true,
    roomNum: '',
    inputMsg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const scene = decodeURIComponent(options.scene)
    if (scene !== 'undefined' || scene !== undefined || scene !== null) {
      console.log('房间号：', scene)
      this.setData({
        isEntryFromQr: true,
        roomNum: scene
      })
      this.socket()
    }
  },
  socket: function() {
    let that = this
    wx.connectSocket({
      url: 'ws://192.168.1.103:8080/chat',
      header: {
        'content-type': 'application/json'
      }
    })
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
  scrollScreen(e) {
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
    }, 800);
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
    wx.sendSocketMessage({
      data: msg
    })
    this.setData({
      inputMsg: ''
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.toBottom()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})