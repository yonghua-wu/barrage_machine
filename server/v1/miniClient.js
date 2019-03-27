const rp = require('request-promise')
const config = require('../config.js')
const router = require('koa-router')()
const db = require('../utils/db.js')
const auth = require('../utils/auth.js')

router.post('/api/v1/mini/user', async (ctx) => {
  console.log(ctx.request.body.code)
  let req = await rp('https://api.weixin.qq.com/sns/jscode2session?appid='+config.appId+'&secret='+config.appSecret+'&js_code='+ctx.request.body.code+'&grant_type=authorization_code')
  req = JSON.parse(req)
  console.log(req)
  if (req.openid) {
    let res = await db.findUserInfo(req.openid)
    if (res === null) { // 如果没有该用户则新建记录
      db.insertLoginInfo(req.openid, req.session_key)
    } else { //如果有该用户，更新session key
      db.updateSessionKey(req.openid, req.session_key)
    }
    ctx.body = {
      status: 0,
      result: {
        token: auth.getToken(req.openid)
      }
    }
  } else {
    ctx.body = {
      status: 500,
      msg: '登陆失败'
    }
  }
})
router.put('/api/v1/mini/user', async (ctx) => {
  console.log(ctx.header.authorization)
  let openid
  try {
    openid = await auth.authToken(ctx.header.authorization)
  } catch(err) {
    ctx.body = {
      status: 20,
      msg: 'token 过期'
    }
  }
  let userinfo = ctx.request.body
  db.insertUserInfo(openid, userinfo.nickName, userinfo.gender, userinfo.avatarUrl)
  ctx.body = {
    status: 0
  }
})

// 查询是否有这个房间
router.get('/api/v1/mini/room', async (ctx) => {
  console.log(ctx.request.query.roomNum)
  ctx.body = {
    status: 0,
    msg: 'ok',
    result: {}
  }
})
module.exports = router
