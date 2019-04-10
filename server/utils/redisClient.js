const redis = require('redis')
const config = require('../config.js')
let redisClient = redis.createClient(config.redis.port, config.redis.host, {password: config.redis.password})

/**
 * 设置redis键值，并设置过期时间
 * @param {String} key 设置的键
 * @param {String, Number} value 设置的值
 * @param {Number} time 缓存多久
 * @return {Promise}
 */
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

/**
 * 通过key获取value
 * @param {String} key 要获取的键
 * @return {Promise}
 */
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
 * 设置key的过期时间
 * @param {String} key key
 * @param {Number} time 时间，以毫秒记
 * @return {Promise}
 */
function redisPexpire(key, time) {
  return new Promise((resolve, reject) => {
    redisClient.pexpire(key, time, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

module.exports = {
  redisGet,
  redisSetEx,
  redisPexpire
}