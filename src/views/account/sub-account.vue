<template>
    <Layout>
      <!--添加子账号-->
      <add-sub-account-dialog ref="addSubAccount"></add-sub-account-dialog>

      <Header>
        <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
          子账号管理
        </div>
        <!--搜索 及 操作栏-->
        <div class="dis-flex align-item-center" style="padding: 20px 0;">
          <img src="../../assets/images/search.png" style="width: 22px; margin-right: 15px;">
          <Input search style="width: 270px;" enter-button="搜索" placeholder="搜索关键字"/>

          <!--删除按钮-->
          <div style="margin-left: auto;">
            <Button type="success" size="small"
                    @click="$refs.addSubAccount.showDialog()"
                    class="bg-6B71F3 common-bt mg-right-10" icon="ios-add">添加</Button>
            <Button type="error" size="small" class="bg-6B71F3 common-bt" icon="ios-trash">删除</Button>
          </div>
        </div>
      </Header>
      <Content class="bg-white">
        <!--表格控件-->
        <table-control
          :data="orderList"
          class="mg-top-10"
          :columns="orderColumns" >
          <Button type="success" size="small" class="bg-28C24D mg-right-10" icon="ios-create">投放</Button>
          <Button type="success" size="small" class="bg-6B71F3 common-bt" icon="ios-create">冻结</Button>
          <Button type="error" size="small" class="bg-F05151" icon="ios-trash">删除</Button>
        </table-control>
      </Content>
    </Layout>
</template>

<script>
import TableControl from '@/components/table-control'
import AddSubAccountDialog from '@/components/account/add-sub-account-dialog'
export default {
  name: 'sub-account',
  components: {AddSubAccountDialog, TableControl},
  data () {
    return {
      orderList: [{name: '你好啊'}],
      orderColumns: [
        {
          type: 'selection',
          width: 60
        },
        {title: '名称', key: 'name'},
        {title: '账号', key: 'name'},
        {title: '密码', key: 'name'},
        {title: '时间', key: 'name'},
        {title: '操作', slot: 'operating', width: 200}
      ]
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-layout-header {
    height: auto !important;
    background-color: white;
    padding: 0;
    line-height: initial;
  }

  /deep/ .ivu-input {
    border: 1px solid #6B71F3 !important;
  }

  /deep/ .ivu-input-search {
    background-color: #6B71F3 !important;
    border-color: #6B71F3 !important;
  }
</style>
