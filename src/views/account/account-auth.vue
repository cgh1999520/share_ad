<template>
  <Layout>
    <Header>
      <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
        账号信息
        <img  :src="getAuthImg" class="auth-status">
        <span class="font-12 color-666666">{{getUserInfo.isAuth === '2' ? '审核中':''}}</span>
      </div>
    </Header>
    <Content class="bg-white pd-20">
      <Form :label-width="100" ref="formEl" :model="formData"
            :rules="rules" :disabled="true">
        <FormItem label="你的姓名：" prop="realName">
          <Input placeholder="请输入你的姓名" :disabled="getUserInfo.isAuth !== '1'"
                 v-model="formData.realName"></Input>
        </FormItem>
        <FormItem label="身份证号：" prop="idcardNum">
          <Input placeholder="请输入你的身份证号" :disabled="getUserInfo.isAuth !== '1'"
                 v-enter-number :maxlength="18" v-model="formData.idcardNum"></Input>
        </FormItem>
        <FormItem label="证件照片：" prop="idcardUrl">
          <custom-img :value="formData.idcardUrl"
                      style="width: 236px;height: 168px" v-show="formData.idcardUrl">
            <Icon type="md-close" slot="operating"
                  v-show="getUserInfo.isAuth === '1'" @click.native="formData.idcardUrl = ''"></Icon>
          </custom-img>
          <upload-file-control style="width: 236px;height: 168px"
                               v-show="!formData.idcardUrl && getUserInfo.isAuth === '1'"
                               v-model="formData.idcardUrl"></upload-file-control>
        </FormItem>
        <FormItem label="营业执照：" prop="licenseUrl">
          <custom-img :value="formData.licenseUrl"
                      style="width: 236px;height: 168px" v-show="formData.licenseUrl">
            <Icon type="md-close" slot="operating"
                  v-show="getUserInfo.isAuth === '1'" @click.native="formData.licenseUrl = ''"></Icon>
          </custom-img>
          <upload-file-control style="width: 236px;height: 168px"
                               v-show="!formData.licenseUrl && getUserInfo.isAuth === '1'"
                               v-model="formData.licenseUrl"></upload-file-control>
        </FormItem>
        <FormItem>
          <Button class="bg-6B71F3 w-100 dis-block pay-bt"
                  v-if="getUserInfo.isAuth === '1'"
                  type="primary" @click="onSubmit">提交</Button>
        </FormItem>
      </Form>
    </Content>
  </Layout>
</template>

<script>
import UploadFileControl from '@/components/upload-file-control'
import {getMemberAuthInfo, memberAuth} from '@/api/module/account'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'account-auth',
  components: {UploadFileControl},
  data () {
    return {
      formData: {
        realName: '',
        idcardNum: '',
        idcardUrl: '',
        licenseUrl: ''
      },
      rules: {
        realName: [{required: true, message: '请输入姓名', trigger: 'change'}],
        idcardNum: [{required: true, message: '请输入身份证号', trigger: 'change'}],
        idcardUrl: [{required: true, message: '请选择身份证照', trigger: 'change'}],
        licenseUrl: [{required: true, message: '请选择营业执照', trigger: 'change'}]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  computed: {
    ...mapGetters(['getUserInfo']),
    /**
     * @Description: 获取认证图片
     * @date 2019/9/16  17:12
    */
    getAuthImg () {
      if (this.getUserInfo.isAuth === '1') return require('../../assets/images/account/auth-error.png')
      else if (this.getUserInfo.isAuth === '2') return require('../../assets/images/account/auth-waiting.png')
      return require('../../assets/images/account/auth-success.png')
    }
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    /**
     * @Description: 获取账号信息
     * @date 2019/9/12  16:58
     */
    getAccountInfo () {
      getMemberAuthInfo().then(res => {
        this.formData = res
      })
    },
    /**
     * @Description: 账号认证
     * @date 2019/9/16  16:10
    */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (!valid) return
        memberAuth(this.formData).then(() => {
          this.updateUserInfo()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-layout-header {
    padding: 10px 0;
    line-height: initial;
    background: white;
  }

  /deep/ .ivu-input[disabled] {
    border: none!important;
    background: none;
    color: #333333;
  }

  /deep/ .ivu-input {
    width: 452px;
    border: 1px solid #6B71F3 !important;
  }

  .auth-status {
    width: 22px;
    height: 22px;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>
