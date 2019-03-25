const router = require('koa-router')()
const crypto = require('crypto')

router.get('/api/v1/web', async (ctx) => {
  const hash = crypto.createHash('md5')
  let roomNum = hash.update(Date.now().toString() + 'dtsf23').digest('hex').slice(0,4)
  ctx.body = {
    room_num: roomNum,
    qrcode_url: '123'
  }
})
module.exports = router
