<template>
  <div id="auth-control-box">
    <div class="auth-title">账号注册</div>
    <!--注册输入框-->
    <Form :model="formData" :rules="rules" ref="formEl">
      <FormItem prop="userName" :error="userNameError">
        <Input
               v-model="formData.userName"
               @on-change="userNameInputChange"
               placeholder="请输入用户名">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
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
                    @click="sendPhoneMsmCode"
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
        <router-link to="/auth?type=retrieve-pws">
          <div class="retrieve-pws">
            忘记密码
          </div>
        </router-link>
      </FormItem>
      <FormItem>
        <Button class="auth-bt" @click="onSubmit">注册</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import CommonMixin from '../../mixins/common-mixin'
import {validPassword, validPhoneNum} from '@/utils/regular'
import {userNameRepeat, userRegister} from '@/api/module/auth'
import {copyObj} from '@/utils/utils'
import md5 from 'md5'
import lodash from 'lodash'

export default {
  name: 'register-control',
  mixins: [CommonMixin],
  data () {
    return {
      userNameError: '', // 用户名错误提示
      formData: {
        userName: '',
        phone: '',
        code: '',
        passWord: ''
      },
      rules: {
        userName: [
          {required: true, message: '请输入用户名', trigger: 'change'},
          {min: 6, message: '用户名长度最小6位', trigger: 'change'}
        ],
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
     * @Description: 用户名输入改变
     * @date 2019/9/11  10:38
    */
    userNameInputChange: lodash.debounce(function () {
      if (this.formData.userName && this.formData.userName.length >= 6) {
        userNameRepeat({userName: this.formData.userName}).then(() => {
          this.userNameError = ''
        }, () => { this.userNameError = '用户名不可用' })
      }
    }, 300),
    /**
     * @Description: 提交
     * @date 2019/9/11  10:13
    */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (valid) {
          let formData = copyObj(this.formData)
          formData.passWord = md5(formData.passWord)
          userRegister(formData).then(() => {
            this.$Message.success('注册成功，请登录')
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
