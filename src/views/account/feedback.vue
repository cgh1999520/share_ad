<template>
  <Layout>
    <Header>
      <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
        意见反馈
      </div>
    </Header>
    <Content class="bg-white pd-20">
      <Form :label-width="100" ref="formEl" :model="formData" :rules="rules">
        <FormItem label="你的姓名：" prop="name">
          <Input placeholder="请输入你的姓名" v-model="formData.name"></Input>
        </FormItem>
        <FormItem label="你的电话：" prop="phone">
          <Input placeholder="请输入你的电话" v-model="formData.phone"></Input>
        </FormItem>
        <FormItem label="你的建议：" prop="content">
         <Input type="textarea" placeholder="请输入你的建议"
                v-model="formData.content" :rows="6"></Input>
        </FormItem>
        <FormItem>
          <Button class="bg-6B71F3 w-100 dis-block pay-bt"
                  @click="onSubmit"
                  type="primary">提交</Button>
        </FormItem>
      </Form>
    </Content>
  </Layout>
</template>

<script>
import UploadFileControl from '@/components/upload-file-control'
import {saveFeedback} from '@/api/module/account'

export default {
  name: 'feedback',
  components: {UploadFileControl},
  data () {
    return {
      rules: {
        name: [{required: true, message: '请输入你的姓名', trigger: 'change'}],
        phone: [{required: true, message: '请输入你的电话', trigger: 'change'}],
        content: [{required: true, message: '请输入你的建议', trigger: 'change'}]
      },
      formData: {
        name: '',
        phone: '',
        content: ''
      }
    }
  },
  methods: {
    /**
     * @Description: 提交
     * @date 2019/9/17  9:52
    */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (!valid) return
        saveFeedback(this.formData).then(() => {
          this.$Message.success('反馈成功')
          this.$refs.formEl.resetFields()
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

  /deep/ .ivu-input {
    width: 452px;
    border: 1px solid #6B71F3 !important;
  }

  .auth-status {
    width: 12px;
    height: 12px;
    vertical-align: middle;
    margin-left: 10px;
  }
</style>
