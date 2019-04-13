const router = require('koa-router')()
const captchapng = require('captchapng')
const config = require('../config.js')
const crypto = require('crypto')
const roomInfo = require('../utils/roomInfo.js')
/**
 * 根据rand生成验证码
 * @param {string} rand 随机数
 * @return {string} 四位十进制字符串
 */
function pin(rand) {
  var str = crypto.createHash('md5').update(rand + config.serverSecret).digest('hex').slice(0,4)
  return parseInt(str, 16).toString().slice(0,4)
}

router.get('/api/v1/web/room', async (ctx) => {
  let roomNum = await roomInfo.useRoom()
  if (roomNum) {
    ctx.body = {
      status: 0,
      result: {
        room_num: roomNum
      }
    }
  } else {
    ctx.body = {
      status: -1,
      result: {},
      msg: '创建房间失败'
    }
  }
})
router.patch('/api/v1/web/room', async (ctx) => {
  var roomNum = ctx.request.body.room_num
  if (roomNum) {
    if (await roomInfo.holdon(roomNum)) {
      ctx.body = {
        status: 0,
        result: {}
      }
    } else {
      ctx.body = {
        status: -1,
        result: {},
        msg: '房间不存在'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      result: {},
      msg: '参数错误'
    }
  }
})

router.get('/api/v1/web/lottery', async (ctx) => {
  let roomNum = ctx.request.query.room_num
  if (roomNum) {
    let nickname = await roomInfo.lottery(roomNum)
    if (nickname) {
      ctx.body = {
        status: 0,
        result: {
          nickname: nickname
        }
      }
    } else {
      ctx.body = {
        status: -1,
        result: {},
        msg: '无人参与抽奖'
      }
    }
  } else {
    ctx.body = {
      status: -1,
      result: {},
      msg: '参数错误'
    }
  }
})

router.delete('/api/v1/web/room', async (ctx) => {
  let roomNum = ctx.request.query.room_num
  if (roomNum) {
    roomInfo.freeRoom(roomNum)
  }
})

router.get('/api/v1/web/img', async (ctx) => {
  var rand = ctx.request.query.rand
  var str = pin(rand)
  var p = new captchapng(100, 35, str)  //生成图片
  p.color(0, 0, 0, 0)
  p.color(80, 80, 80, 255)
  var img = p.getBase64()
  // eslint-disable-next-line no-undef
  var imgbase64 = Buffer.from(img, 'base64')
  ctx.response.header = {
    'Content-Type': 'image/png'
  }
  ctx.body = imgbase64
})

router.post('/api/v1/web/login_room', async (ctx) => {
  var data = ctx.request.body
  if (pin(data.rand) != data.pin) {
    ctx.body = {
      status: 20,
      result: {},
      msg: '验证码错误'
    }
  }else {
    if(await roomInfo.select(data.roomNum)) {
      if ( data.notNewUser || await roomInfo.sevaUser(data.roomNum, data.nickname)) {
        ctx.body = {
          status: 0,
          result: {}
        }
      } else {
        ctx.body = {
          status: -1,
          result: {},
          msg: '昵称已被占用'
        }
      }
    } else {
      ctx.body = {
        status: -1,
        result: {},
        msg: '房间未创建'
      }
    }
  }
})
module.exports = router
