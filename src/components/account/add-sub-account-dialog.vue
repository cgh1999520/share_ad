<template>
  <dialog-control
    title="添加账号"
    v-model="isShowDialog" >
    <Card style="padding: 23px 89px;width: 100%;" >
      <div style="font-size: 20px;" class="color-808080 tx-center mg-bottom-10">
        添加账号
      </div>
      <Form>
        <FormItem>
          <Input placeholder="请输入账号"></Input>
        </FormItem>
        <FormItem>
          <Input placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem>
          <Input placeholder="请输入密码" type="password"></Input>
        </FormItem>
      </Form>
      <Button class="radius-common-bt w-200 dis-block mg-auto" style="margin-top: 35px;" type="success">确认并提交</Button>
    </Card>
  </dialog-control>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import DialogMixin from '@/mixins/dialog-mixin'
export default {
  name: 'add-sub-account-dialog',
  components: {DialogControl},
  mixins: [DialogMixin]
}
</script>

<style scoped lang="less">

  /deep/ .ivu-form-item {
    margin: 0;
    border-top: 1px solid #E6E6E6;
    border-bottom: 1px solid #E6E6E6;
  }

  /deep/ .ivu-input {
    border: none !important;
    height: 100%;
  }

  /deep/ .ivu-input-group-prepend,
  /deep/ .ivu-input-group-append {
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
