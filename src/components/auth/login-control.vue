<template>
  <div id="auth-control-box">
    <div class="auth-title">账号登录</div>
    <!--登录框-->
    <Form :model="formData" :rules="rules" ref="formEl">
      <FormItem prop="userName">
        <Input type="text" v-model="formData.userName" placeholder="用户名/手机号">
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </FormItem>
      <FormItem prop="password">
        <Input type="password" v-model="formData.passWord"
               @keydown.enter="onSubmit" placeholder="密码">
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
        <Button class="auth-bt"
                :loading="isLoading" @click="onSubmit">登录</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import md5 from 'md5'
import {copyObj} from '@/utils/utils'
export default {
  name: 'login-control',
  data () {
    return {
      isLoading: false,
      formData: {
        userName: '',
        passWord: ''
      },
      rules: {
        userName: [{required: true, message: '请输入用户名/手机号', trigger: 'change'}],
        passWord: [{required: true, message: '请输入密码', trigger: 'change'}]
      }
    }
  },
  methods: {
    ...mapActions(['userLogin']),
    /**
       * @Description: 登录系统
       * @date 2019/7/31  17:40
       */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (valid) {
          this.isLoading = true
          let formData = copyObj(this.formData)
          formData.passWord = md5(formData.passWord)
          this.userLogin(formData).then(res => {
            this.$router.replace({
              path: '/index'
            })
          }, () => { this.isLoading = false })
        }
      })
    }
  }
}
</script>
