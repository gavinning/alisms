const AliSMS = require('../lib/alisms')
const AliSMSConfig = require('./alisms.conf')
const Redis = require('ioredis')
const redis = new Redis()
const assert = require('assert')

const alisms = new AliSMS({ ...AliSMSConfig, redis })

describe('test class AliSMS', () => {
    const telephone = 13001033940
    const passcodeKey = `app:passcode:sms:${telephone}`

    it('test create', async () => {
        const code = await alisms.create(telephone)
        const result = await redis.get(passcodeKey)
        assert.equal(code, result)
        redis.expire(passcodeKey, 0)
    })

    it('test create, $query', async () => {
        const code = await alisms.create(telephone)
        const result = await alisms.$query(telephone)
        assert.equal(code, result)
        redis.expire(passcodeKey, 0)
    })

    it('test create, verify', async () => {
        const code = await alisms.create(telephone)
        const result = await alisms.verify(telephone, code)
        assert.equal(true, result)
        redis.expire(passcodeKey, 0)
    })

    // 测试短信发送可以打开当前注释，记得修改telephone的值
    // it('test publish, verify', async () => {
    //     const code = await alisms.publish(telephone)
    //     const result = await alisms.verify(telephone, code)
    //     assert.equal(true, result)
    //     redis.expire(passcodeKey, 300)
    // })
})
