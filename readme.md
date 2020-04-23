Alisms
---
阿里云短信验证码发送和验证

### Install
```sh
npm i @4a/alisms
```

### Usage
```js
const AliSMS = require('@4a/alisms')
const AliSMSConfig = {
    AccessKeyId: "your AccessKeyId",
    AccessKeySecret: "your AccessKeySecret",
    RegionId: 'your RegionId',
    SignName: 'your SignName',
    TemplateCode: 'your TemplateCode'
}

const Redis = require('ioredis')
const redis = new Redis()

const alisms = new AliSMS({ ...AliSMSConfig, redis })


// 创建一个短信验证码
// 模拟发送，测试环境使用该api
alisms.create(telephone)


// 创建一个短信验证码
// 真实发送，生产环境使用该api
alisms.publish(telephone)


// 验证短信验证码是否合法
alisms.verify(telephone, code)
```

### Example
> npm test
