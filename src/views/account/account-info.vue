<template>
  <Layout>
    <!--    修改手机号 控件-->
    <update-phone-dialog
      :finish="updateUserInfo"
    ref="updatePhone">
    </update-phone-dialog>

    <Header>
      <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
        账号信息
      </div>
    </Header>
    <Content class="bg-white pd-20">
        <Form :label-width="100">
          <Row>
            <Col :span="6">
                <FormItem label="昵称：">
                  <Input v-model="formData.nickName"></Input>
              </FormItem>
            </Col>
            <Col :span="6">
                <FormItem label="账号：">
                  <Input :value="getUserInfo.userName" :disabled="true"></Input>
              </FormItem>
            </Col>
            <Col :span="6">
                <FormItem label="电话：">
                  <Input :value="getUserInfo.telephone" :disabled="true">
                    <button class="common-bt color-666666" slot="append"
                            @click="$refs.updatePhone.showDialog()">更改</button>
                  </Input>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="邮箱：">
                <Input v-model="formData.email"></Input>
              </FormItem>
            </Col>
          </Row>
<!--          <Row>
            <Col :span="6">
              <FormItem label="性别：">
                <Input></Input>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="生日：">
                <DatePicker type="date" class="w-100b" placeholder="Select date"></DatePicker>
              </FormItem>
            </Col>
            <Col :span="12">
              <FormItem label="住址：">
                <Input></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :span="6">
              <FormItem label="证件：">
                <Input></Input>
              </FormItem>
            </Col>
            <Col :span="6">
              <FormItem label="注册日期：">
                <Input></Input>
              </FormItem>
            </Col>
          </Row>-->
        </Form>
      <Button class="bg-6B71F3 w-100 dis-block pay-bt"
              @click="onSubmit"
              type="primary">保存</Button>
    </Content>
  </Layout>
</template>

<script>
import {updateMemberInfo} from '../../api/module/account'
import {mapGetters, mapActions} from 'vuex'
import {copyObj} from '../../utils/utils'
import UpdatePhoneDialog from '../../components/account/update-phone-dialog'

export default {
  name: 'account-info',
  components: {UpdatePhoneDialog},
  data () {
    return {
      formData: {
        nickName: '',
        email: ''
      },
      userDetail: {}
    }
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  created () {
    this.formData = copyObj(this.getUserInfo, this.formData)
    console.log(this.formData, '用户信息')
  },
  methods: {
    ...mapActions(['updateUserInfo']),
    /**
    * @Description: 提交请求
    * @date 2019/9/19  16:08
    */
    onSubmit () {
      updateMemberInfo(this.formData).then(() => {
        this.updateUserInfo()
        this.$Message.success('更改成功')
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

  /deep/ .ivu-input, /deep/.ivu-select-selection {
    border: 1px solid #6B71F3 !important;
  }

</style>
