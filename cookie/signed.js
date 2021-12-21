const crypto = require('crypto')
const values = ['age', 20]
const secret = 'lihh-test'

const toBase64URL = (str) => {
  // 针对转换base64位 如果是= 直接替换位空 如果是+号 直接替换为- 如果是/ 直接替换为_
  return str.replace(/\=/gi, '').replace(/\+/g, '-').replace(/\//g, '_')
}

const content = toBase64URL(crypto.createHmac('sha1', secret).update(values.join('=')).digest('base64'))
console.log(content === '1KCzh4f24Jd8gbS2NwB9W7znAo8') // true
