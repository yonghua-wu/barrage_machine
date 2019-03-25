const redis = require('redis')
const util = require('util')
const rp = require('request-promise')
const config = require('../config.js')
let redisClient = redis.createClient(config.redis.port, config.redis.host, {password: config.redis.password})

function redisSet(key, value) {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
function redisSetEx(key, value, time=0) {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, 'EX', time, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
function redisGet(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}
/**
 * 获取AccessToken
 * @returns {object} 
 */
async function getAccessToken() {
  try {
    let token = await redisGet('AccessToken')
  } catch(err) {
    return {
      err: err,
      msg: 'redisGet执行失败'
    }
  }
  // 如果AccessToken为空，向微信请求新的AccessToken
  if (token === null) {
    try {
      let req = await rp('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+ config.appId +'&secret=' + config.appSecret)
    } catch(err) {
      return {
        err: err,
        msg: '发送请求失败，rp()'
      }
    }
    req = JSON.parse(req)
    try {
      await redisSetEx('AccessToken', req.access_token, req.expires_in)
    } catch(err) {
      return {
        err: err,
        msg: 'redisSetEx执行失败'
      }
    }
    // 返回新的AccessToken
    return {
      token: req.access_token
      err: null
    }
  // 非空，返回这个AccessToken
  } else {
    return {
      token: token
      err: null
    }
  }
}
module.exports = getAccessToken