const URL = request('./config.js').URL
function wxrequest(url, method, data) {
  let that = this
  let token = wx.getStorageSync('token') || ''
  return new Promise((resolve, reject) => {
    wx.request({
      url: that.URL.host + url,
      method: method,
      data: data,
      header: {
        'content-type': 'application/json',
        'token': token
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
  let that = this
  return new Promise((resolve, reject) => {
    wx.login({
      success: function (res) {
        console.log(res.code)
        that.wxrequest(that.URL.loginUrl, 'POST', {
          code: res.code
        }).then(res => {
          if (!res.result.token) {
            reject({
              err: -101,
              msg: 'Login failed'
            })
          }
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
async function request (url, method, data) {
  try {
    let req = await wxrequest(url, method, data)
  } catch (err) {
    return err
  }
  // token 过期，重新登陆
  if (req.status === 20) {
    try {
      await login()
    } catch (err) {
      return err
    } 
    return await wxrequest(url, method, data)
  } else {
    return req
  }
}
function get(url, data) {
  return request(url, 'GET', data)
}
function post(url, data) {
  return request(url, 'POST', data)
}
function put(url, data) {
  return request(url, 'PUT', data)
}
function del(url, data) {
  return request(url, 'DELETE', data)
}
module.exports = {
  get,
  post,
  put,
  del,
  login
}