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
function redisExpire(key, time) {
  return new Promise((resolve, reject) => {
    redisClient.expire(key, time, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * 删除key
 * @param {String} key 要删除的key
 */
function redisDel(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, res) => {
      if (err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * 获取列表长度
 * @param {String} key 列表名字
 * @return {Promise}
 */
function redisLlen(key) {
  return new Promise((resolve, reject) => {
    redisClient.llen(key, (err, res) => {
      if(err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * 将一个或多个值插入到key的右边
 * @param {String} key 列表名字
 * @param {String | String[]} values 列表值
 * @return {Promise}
 */
function redisRpush(key, values) {
  return new Promise((resolve, reject) => {
    redisClient.rpush(key, values, (err, res) => {
      if(err) {
        reject(err)
      } else {
        resolve(res)
      }
    })
  })
}

/**
 * 返回并删除列表的第一个值
 * @param {String} key 列表名字
 * @return {Promise}
 */
function redisLpop(key) {
  return new Promise((resolve, reject) => {
    redisClient.lpop(key, (err, res) => {
      if(err) {
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
  redisExpire,
  redisLlen,
  redisRpush,
  redisLpop,
  redisDel
}