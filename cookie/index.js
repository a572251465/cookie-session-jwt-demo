const Koa = require('koa')
const Router = require('@koa/router')

const app = new Koa()
const route = new Router()

// 签名
app.keys = ['lihh-test']

route.get('/write', (ctx) => {
  ctx.cookies.set('age', 20, {
    // // 设置domain 表示子域a.lihh/ b.lihh 可以共享父域的cookie
    domain: 'lihh.com',
    // // 如果设置了httpOnly为true的话 客户端通过document.cookie是获取不到的
    httpOnly: true,
    signed: true
  })
  ctx.body = '设置成功'
})

route.get('/read', (ctx) => {
  ctx.body = ctx.cookies.get('age') || 'empty'
})

route.get('/check', (ctx) => {
  ctx.body =
    ctx.cookies.get('age', {
      signed: true
    }) || 'error'
})

app.use(route.routes()).use(route.allowedMethods())

app.listen(4000, () => {
  console.log(`服务启动成功在${4000}端口上`)
})
