<template>
  <div id="auth-control-box">
    <div class="auth-title">忘记密码</div>
    <!--登录框-->
    <Form :model="formData" :rules="rules" ref="formEl">
      <FormItem prop="phone">
        <Input type="number"
               v-model="formData.phone"
               v-enter-number
               placeholder="请输入手机号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="code">
        <Input type="number" v-enter-number v-model="formData.code" placeholder="请输入验证码">
          <Icon type="ios-barcode-outline" slot="prepend"/>
          <div slot="append" class="bg-white">
            <Button class="button send-sms-code-bt radius-5 bg-6B71F3"
                    @click="sendPhoneMsmCode('login')"
                    :disabled="isSendSmsIng">
              {{isSendSmsIng ? smsCodeTime + '秒重发' : '发送验证码'}}
            </Button>
          </div>
        </Input>
      </FormItem>
      <FormItem prop="passWord">
        <Input type="password" v-model="formData.passWord" placeholder="请输入密码">
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem>
        <router-link to="/auth">
          <div class="retrieve-pws">
            账号登录
          </div>
        </router-link>
      </FormItem>
      <FormItem>
        <Button class="auth-bt" @click="onSubmit">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {copyObj} from '@/utils/utils'
import * as md5 from 'md5'
import CommonMixin from '../../mixins/common-mixin'
import {validPassword, validPhoneNum} from '@/utils/regular'
import {retrievePassword} from '@/api/module/auth'

export default {
  name: 'retrieve-password-control',
  mixins: [CommonMixin],
  data () {
    return {
      formData: {
        phone: '',
        code: '',
        passWord: ''
      },
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'change', target: 'number'},
          {validator: validPhoneNum, trigger: 'change'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'change', target: 'number'}
        ],
        passWord: [
          {validator: validPassword, trigger: 'change'},
          {required: true, message: '请输入密码', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    /**
     * @Description: 提交
     * @date 2019/9/11  10:13
     */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (valid) {
          let formData = copyObj(this.formData)
          formData.passWord = md5(formData.passWord)
          retrievePassword(formData).then(() => {
            this.$Message.success('更新密码成功，请登录')
            this.$router.replace({
              path: '/auth'
            })
          })
        }
      })
    }
  }
}
</script>
