const Koa = require('koa')
const Router = require('@koa/router')
const crypto = require('crypto')

const app = new Koa()
const route = new Router()

const secret = 'zf'

// jwt实现过程
const jwt = {
  // 生成签名
  sign(content, secret) {
    return this.toBase64URL(crypto.createHmac('sha256', secret).update(content).digest('base64'))
  },

  // base64位特殊转换
  toBase64URL: (str) => {
    return str.replace(/\=/g, '').replace(/\+/g, '-').replace(/\//, '_')
  },
  base64urlUnescape(str) {
    str += new Array(5 - (str.length % 4)).join('=')
    return str.replace(/-/g, '+').replace(/_/g, '/')
  },

  // 转换base64
  toBase64(content) {
    return this.toBase64URL(Buffer.from(JSON.stringify(content)).toString('base64'))
  },

  // 生成token
  encode(info, secret) {
    const head = this.toBase64({ typ: 'JWT', alg: 'HS256' })
    const content = this.toBase64(info)
    const sign = this.sign([head, '.', content].join(''), secret)

    // 加密类型(sha256) + 加密内容 + 通过盐值来生成签名
    return head + '.' + content + '.' + sign
  },

  // 验证token 获取值
  decode(token, secret) {
    let [head, content, sign] = token.split('.')
    // 通过类型 + 内容 生成新的签名
    let newSign = this.sign([head, content].join('.'), secret)
    // 判断新旧签名是否一致
    if (newSign == sign) {
      return JSON.parse(Buffer.from(this.base64urlUnescape(content), 'base64').toString())
    } else {
      throw new Error('用户更改了信息')
    }
  }
}

route.get('/login', async (ctx, next) => {
  console.log('--------------------------')
  let user = {
    id: '110',
    username: 'zs'
    // 令牌的过期时间
  }
  // 生成令牌的数据不要太多，一般情况下用用户的id就可以了
  let token = jwt.encode(user, secret)
  ctx.body = {
    err: 0,
    data: {
      token,
      user
    }
  }
})
route.get('/validate', async (ctx, next) => {
  try {
    let user = jwt.decode(ctx.get('Authorization').split(' ')[1], secret)

    console.log(user.id, 'findUser')
    ctx.body = {
      err: 0,
      data: {
        user
      }
    }
  } catch (e) {
    ctx.body = {
      err: 1
    }
  }
})

app.use(route.routes()).use(route.allowedMethods())

app.listen(3001, () => {
  console.log('服务启动在3001端口')
})
