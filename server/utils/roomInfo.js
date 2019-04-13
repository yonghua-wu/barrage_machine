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
      await redisClient.redisSetEx(roomNum, 1, 25)
      await sevaUser(roomNum, '`')
      await redisClient.redisExpire('users' + roomNum, 25)
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
    await redisClient.redisExpire(roomNum, 25)
    await redisClient.redisExpire('users' + roomNum, 25)
    return true
  } catch (e) {
    return false
  }
}

/**
 * 创建房间列表
 */
async function createRooms() {
  let a = []
  for(let i=1; i<10000; i++) {
    a.push(i.toString())
  }
  try {
    await redisClient.redisRpush('rooms', a)
    return true
  } catch (err) {
    return false
  }
}

/**
 * 创建一个房间
 */
async function useRoom() {
  try {
    if (! await redisClient.redisLlen('rooms')) {
      await createRooms()
    }
    let roomNum
    do {
      roomNum = await redisClient.redisLpop('rooms')
    } while(! await regist(roomNum))
    return roomNum
  } catch (e) {
    return false
  }
}

/**
 * 释放房间
 * @param {String} roomNum 要释放的房间号
 */
async function freeRoom(roomNum) {
  await redisClient.redisDel(roomNum)
}

/**
 * 保存用户昵称
 * @param {String} roomNum 房间号
 * @param {String} nickname 昵称
 */
async function sevaUser(roomNum, nickname) {
  let key = 'users' + roomNum
  if (await redisClient.redisSadd(key, nickname)) {
    return true
  } else {
    return false
  }
}

/**
 * 抽奖
 * @param {String} roomNum 房间号
 */
async function lottery(roomNum) {
  try {
    if( await redisClient.redisScard('users'+roomNum) == 1) {
      return false
    } else {
      let nickname
      do {
        nickname = await redisClient.redisSrandmember('users'+roomNum)
      } while(nickname == '`')
      return nickname
    }
  } catch(e) {
    return false
  }
}

module.exports = {
  select,
  regist,
  holdon,
  useRoom,
  freeRoom,
  sevaUser,
  lottery
}