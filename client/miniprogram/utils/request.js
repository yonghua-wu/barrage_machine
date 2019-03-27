const URL = require('./config.js').URL

// import { URL } from './config.js'
function wxrequest(url, method, data) {
  // eslint-disable-next-line no-undef
  let token = wx.getStorageSync('token') || ''
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    wx.request({
      url: URL.host + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'authorization': token
      },
      success: function (req) {
        resolve(req.data)
      },
      fail: function (req) {
        reject({
          err: -101,
          msg: 'request failed',
          req: req
        })
      }
    })
  })
}

function login() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    wx.login({
      success: function (res) {
        console.log(res.code)
        wxrequest(URL.loginUrl, 'POST', {
          code: res.code
        }).then(res => {
          if (!res.result.token) {
            reject({
              err: -102,
              msg: 'Login failed'
            })
          }
          // eslint-disable-next-line no-undef
          wx.setStorageSync('token', res.result.token)
          resolve({
            err: 0,
            msg: 'logged'
          })
        }).catch(res => {
          reject(res)
        })
      }
    })
  })
}

function request (url, method, data) {
  return new Promise((resolve, reject) => {
    wxrequest(url, method, data).then( req => {
      if (req.status === 20) { //token过期
        login().then(() => {   // 重新登陆
          return wxrequest(url, method, data)  //重新发送请求
        }).then((req) => {
          if (req.status === 0) {
            resolve(req.result)
          } else {
            reject(req.status)
          }
        }).catch(req => {
          reject(req)
        })
      } else if (req.status === 0) {
        resolve(req.result)
      } else {
        reject(req.status)
      }
    }).catch(req => {
      reject(req)
    })
  })
}
//从服务器上获取一个具体的资源或者一个资源列表。
function get(url, data) {
  return request(url, 'GET', data)
}

//在服务器上创建一个新的资源。
function post(url, data) {
  return request(url, 'POST', data)
}

//以整体的方式更新服务器上的一个资源。
function put(url, data) {
  return request(url, 'PUT', data)
}

//只更新服务器上一个资源的一个属性。
function patch(url, data) {
  return request(url, 'PATCH', data)
}

//删除服务器上的一个资源。
function del(url, data) {
  return request(url, 'DELETE', data)
}

module.exports = {
  get,
  post,
  put,
  del,
  patch,
  login
}