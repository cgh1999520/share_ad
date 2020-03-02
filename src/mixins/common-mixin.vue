
<script>
import {sendPhoneMsmCode} from '@/api/module/common'
export default {
  name: 'common-mixin',
  data () {
    return {
      smsCodeTime: 60, // 短信验证码计时
      smsCodeTimer: undefined, // 短信验证码计时器
      isSendSmsIng: false // 是否已经发送验证码
    }
  },
  methods: {
    /**
     * @Description: 发送短信验证码
     * @date 2019/9/11  9:58
    */
    sendPhoneMsmCode (type = 'register') {
      if (this.smsCodeTime === 60) {
        if (!this.formData.phone) return this.$Message.error('请输入正确的手机号')
        sendPhoneMsmCode({
          userName: this.formData.userName || '',
          phone: this.formData.phone
        }, type).then(() => {
          this.isSendSmsIng = true
          this.smsCodeTimer = setInterval(() => {
            this.smsCodeTime--
            // 当验证码为0时，则复位
            if (this.smsCodeTime === 0) {
              clearInterval(this.smsCodeTimer)
              this.smsCodeTime = 60
              this.isSendSmsIng = false
            }
          }, 1000)
        })
      }
    }
  }
}
</script>
