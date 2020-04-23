const Core = require('@alicloud/pop-core')

class AliSMS {
    constructor({ AccessKeyId, AccessKeySecret, RegionId, SignName, TemplateCode, redis }) {
        this.ops = {
            AccessKeyId,
            AccessKeySecret,
            RegionId,
            SignName,
            TemplateCode
        }
        this.redis = redis
    }

    async create(telephone) {
        const code = AliSMS.code()
        await this.$save(telephone, code)
        return code
    }

    async publish(telephone) {
        const code = AliSMS.code()
        await this.$save(telephone, code)
        await this.$send(telephone, code)
        return code
    }

    async verify(telephone, code) {
        return Number(code) === Number(await this.$query(telephone))
    }

    $send(telephone, code) {
        return this.$sms().request('SendSms', this.$params(telephone, code), { method: 'POST' })
    }

    $save(telephone, code) {
        return this.redis.set(AliSMS.getKey(telephone), code, 'EX', 10 * 60)
    }

    $query(telephone) {
        return this.redis.get(AliSMS.getKey(telephone))
    }

    $sms() {
        return new Core(this.$aliyun())
    }

    $aliyun() {
        return {
            accessKeyId: this.ops.AccessKeyId,
            accessKeySecret: this.ops.AccessKeySecret,
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25',
        }
    }

    $params(telephone, code) {
        return {
            RegionId: this.ops.RegionId,
            SignName: this.ops.SignName,
            TemplateCode: this.ops.TemplateCode,
            PhoneNumbers: telephone,
            TemplateParam: JSON.stringify({ code }),
        }
    }

    static getKey(key) {
        return `app:passcode:sms:${key}`
    }

    static code() {
        return Math.round(Math.random() * 1000000).toString().slice(0, 4)
    }
}

module.exports = AliSMS
