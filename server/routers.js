const compose = require('koa-compose')
const glob = require('glob')
const { resolve } = require('path')

registerRouter = () => {
    let routers = [];
    glob.sync(resolve(__dirname, 'v1/', '**/*.js'))
        .map(router => {
            routers.push(require(router).routes())
            routers.push(require(router).allowedMethods())
        })
    return compose(routers)
}

module.exports = registerRouter