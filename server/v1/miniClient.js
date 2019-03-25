const router = require('koa-router')()

router.get('/api/v1/user/:id', async (ctx) => {
  ctx.body = ctx.params.id
})
module.exports = router
