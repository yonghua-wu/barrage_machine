const request = require('../../utils/request.js')
const tips = require('../../utils/tips.js')
// eslint-disable-next-line no-undef
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputRoomNum: '',      // 当前输入的房间号
    roomNum: ''
  },
  onLoad: function (options) {
    let scene = decodeURIComponent(options.scene)
    if (scene !== 'undefined' && scene !== undefined && scene !== null) {
      scene = scene.toUpperCase()
      console.log('房间号：', scene)
      this.setData({
        inputRoomNum: scene,
        roomNum: scene
      })
    }
  },
  joinRoom(e) {
    console.log(e)
    // eslint-disable-next-line no-undef
    let userInfo = wx.getStorageSync('userInfo') || ''
    if (e.detail.userInfo) {
      if(!userInfo) { // 如果本地缓存的userInfo是空的说明是第一次进入
        userInfo = {
          nickName: e.detail.userInfo.nickName,
          gender: e.detail.userInfo.gender,
          avatarUrl: e.detail.userInfo.avatarUrl
        }
        // eslint-disable-next-line no-undef
        wx.setStorageSync('userInfo', userInfo)
        request.put('/user', userInfo) //提交信息到服务器
      }
      if (this.data.inputRoomNum) { // 如果输入的不为空，检查这个房间是否在使用，在使用可以进入，未使用不能进入
        request.get('/room', {
          roomNum: this.data.inputRoomNum
        }).then( () => {
          // 进入房间
          console.log('enter room')
        }).catch( () => {
          // 不进入房间，并提示房间未开放
          tips.showToast('fail', '房间未开放')
        })
      }
    } else {
      tips.showToast('warn', '请先授权信息')
    }
  },
  bindRoomNum(e) {
    this.setData({
      inputRoomNum: e.detail.value.toUpperCase()
    })
  }
})