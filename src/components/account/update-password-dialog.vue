<template>
    <dialog-control
    title="修改密码"
    v-model="isShowDialog"
    @close="closeDialog">
        <Card style="padding: 23px 89px;width: 100%;" >
          <div style="font-size: 20px;" class="color-808080 tx-center mg-bottom-10">
            修改密码
          </div>
          <!--注册输入框-->
          <Form :model="formData" :rules="rules" ref="formEl">
            <FormItem prop="passWord">
              <Input type="password" v-model="formData.passWord" placeholder="请输入原密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="newPassWord">
              <Input type="password" v-model="formData.newPassWord" placeholder="请输入新密码">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
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
import DialogMixin from '@/mixins/dialog-mixin'
import {validPassword} from '@/utils/regular'
import {copyObj} from '@/utils/utils'
import md5 from 'md5'
import {updatePassWord} from '@/api/module/account'

export default {
  name: 'update-password-dialog',
  components: {DialogControl},
  mixins: [DialogMixin],
  data () {
    return {
      formData: {
        passWord: '',
        newPassWord: ''
      },
      rules: {
        passWord: [
          {validator: validPassword, trigger: 'change'},
          {required: true, message: '请输入原密码', trigger: 'change'}
        ],
        newPassWord: [
          {validator: validPassword, trigger: 'change'},
          {required: true, message: '请输入新密码', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    /**
     * @Description: 提交
     * @date 2019/9/16  16:26
    */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (!valid) return
        let formData = copyObj(this.formData)
        formData.passWord = md5(formData.passWord)
        formData.newPassWord = md5(formData.newPassWord)
        updatePassWord(formData).then(() => {
          this.$router.replace({
            path: '/auth'
          })
          sessionStorage.clear()
          this.$Message.success('更改密码成功，请重新登录')
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
