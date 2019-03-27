const Koa = require('koa')
const WebSocket = require('ws')
const bodyParser = require('koa-bodyparser')
// const url = require('url')
const regRouter = require('./routers.js')
const app = new Koa()
const WebSocketServer = WebSocket.Server

app.use(bodyParser())
app.use(regRouter())

let server = app.listen(8080)

function createWebSocketServer(server, onMessage) {
  // 创建 WebSocketServer
  let wss = new WebSocketServer({
    server: server
  })
  // 为wss添加broadcast方法，用来广播消息
  wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      client.send(data)
    })
  }
  onMessage = onMessage || function (msg) {
    console.log('[WebSocket] message received: ' + msg)
  }
  wss.on('connection', function (ws, req) {
    if (req.url !== '/chat') {
      ws.close(4000, 'Invalid URL')
    }
    ws.on('message', onMessage)
    ws.wss = wss
  })
  return wss
}

function onMessage(message) {
  console.log(message)
  this.wss.broadcast(message)
}

app.wss = createWebSocketServer(server, onMessage)

console.log('app started at port 3000...')