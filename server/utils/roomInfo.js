const redisClient = require('./redisClient.js')

/**
 * 在redis中查找roomNum
 * @param {String} roomNum 房间号
 * @return {Boolean}
 */
async function select(roomNum) {
  try {
    let value = await redisClient.redisGet(roomNum)
    if (value) {
      return true
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}

/**
 * 记录房间号，返回false表示失败，可能原因是房间号已被占用
 * @param {String} roomNum 要记录的房间号
 * @return {boolean}
 */
async function regist(roomNum) {
  try {
    if (await select(roomNum)) {
      return false
    } else {
      await redisClient.redisSetEx(roomNum, 1, 1000*60*5)
      return true
    }
  } catch (e) {
    return false
  }
}

/**
 * 更新roomNum的过期时间
 * @param {String} roomNum 房间号
 */
async function holdon(roomNum) {
  try {
    await redisClient.redisPexpire(roomNum, 1000*60*5)
    return true
  } catch (e) {
    return false
  }
}

module.exports = {
  select,
  regist,
  holdon
}