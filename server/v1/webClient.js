const router = require('koa-router')()

router.get('/api/v1/web/room', async (ctx) => {
  ctx.body = {
    status: 0,
    result: {
      room_num: 1,
      qr_url: 'xxxx'
    }
  }
})
module.exports = router
