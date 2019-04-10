// const util = require('util')
const config = require('../config.js')
const rp = require('request-promise')
const redisClient = require('./redisClient.js')
/**
 * 获取AccessToken
 * @returns {object} 
 */
async function getAccessToken() {
  let token
  try {
    token = await redisClient.redisGet('AccessToken')
  } catch(err) {
    return {
      err: err,
      msg: 'redisGet执行失败'
    }
  }
  // 如果AccessToken为空，向微信请求新的AccessToken
  if (token === null) {
    let req
    try {
      req = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ config.appId +'&secret=' + config.appSecret)
    } catch(err) {
      return {
        err: err,
        msg: '发送请求失败，rp()'
      }
    }
    req = JSON.parse(req)
    try {
      await redisClient.redisSetEx('AccessToken', req.access_token, req.expires_in)
    } catch(err) {
      return {
        err: err,
        msg: 'redisSetEx执行失败'
      }
    }
    // 返回新的AccessToken
    return {
      token: req.access_token,
      err: null
    }
  // 非空，返回这个AccessToken
  } else {
    return {
      token: token,
      err: null
    }
  }
}
module.exports = getAccessToken