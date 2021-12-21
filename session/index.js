const Koa = require('koa')
const Router = require('@koa/router')
const uuid = require('uuid')
const app = new Koa()

// 密钥
const secret = 'zfsecret'
app.keys = [secret]
const router = new Router()

let cardName = 'lihh-test' // 店铺名字
// 变量内存 正式环境一般都是redis
let session = {}
router.get('/wash', async function (ctx) {
  // 也是存储到cookie 加盐算法 保护id
  const hasVisit = ctx.cookies.get(cardName, { signed: true })

  // 判断cookie中是否存在
  if (hasVisit && session[hasVisit]) {
    // 必须保证你的卡是我的店的
    session[hasVisit].mny -= 100
    ctx.body = '恭喜你消费了 ' + session[hasVisit].mny
  } else {
    const id = uuid.v4() //冲500
    session[id] = { mny: 500 }

    // 给cookie中设置内容
    ctx.cookies.set(cardName, id, { signed: true })
    ctx.body = '恭喜你已经是本店会员了 有500元'
  }
})
// ssr 前后端同构的时候 用session来事件用户鉴别是最方便的
app.use(router.routes()).use(router.allowedMethods()) // 405

app.listen(5000, function () {
  console.log(`server start 5000`)
})
