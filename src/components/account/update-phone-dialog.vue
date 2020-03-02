<template>
    <dialog-control
    title="修改手机号"
    @close="closeDialog"
    v-model="isShowDialog" >
        <Card style="padding: 23px 89px;width: 100%;" >
          <!--注册输入框-->
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
                          @click="sendPhoneMsmCode"
                          :disabled="isSendSmsIng">
                    {{isSendSmsIng ? smsCodeTime + '秒重发' : '发送验证码'}}
                  </Button>
                </div>
              </Input>
            </FormItem>
          </Form>
          <Button class="radius-common-bt w-200 dis-block mg-auto"
                  @click="onSubmit"
                  style="margin-top: 35px;" type="success">确认并提交</Button>
        </Card>
    </dialog-control>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import DialogMixin from '../../mixins/dialog-mixin'
import CommonMixin from '../../mixins/common-mixin'
import {validPhoneNum} from '../../utils/regular'
import {updateMemberPhone} from '../../api/module/account'
import {mapGetters} from 'vuex'

export default {
  name: 'update-phone-dialog',
  components: {DialogControl},
  mixins: [DialogMixin, CommonMixin],
  data () {
    return {
      formData: {
        phone: '',
        code: '',
        userName: ''
      },
      rules: {
        phone: [
          {required: true, message: '请输入手机号', trigger: 'change', target: 'number'},
          {validator: validPhoneNum, trigger: 'change'}
        ],
        code: [
          {required: true, message: '请输入验证码', trigger: 'change', target: 'number'}
        ]
      }
    }
  },
  created () {
    this.formData.userName = this.getUserInfo.userName
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    /**
     * @Description: 提交
     * @date 2019/9/16  16:26
    */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (!valid) return
        updateMemberPhone(this.formData).then(() => {
          this.$Message.success('更新成功')
          if (this.finish) this.finish()
        })
      })
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-form-item {
    margin: 0;
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
  }

  /deep/ .ivu-input {
    border: none;
    height: 100%;
  }

  /deep/ .ivu-input-group-prepend, /deep/ .ivu-input-group-append {
    background: none;
    border: none;
  }
  /deep/ .ivu-input-group-prepend {
    width: 34px;
  }

  /deep/ .ivu-input-group {
    height: 41px;
    margin-top: 20px;
    border: 1px solid #e0e0e0;
  }
</style>
