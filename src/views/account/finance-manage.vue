<template>
  <Layout>
    <!--充值余额-->
    <recharge-balance-dialog ref="rechargeBalance"
      >
    </recharge-balance-dialog>

    <Header>
      <div class="color-4D4D4D" style="font-size: 22px;">
        <span style="width: 9px;height: 9px;"
              class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
        财务管理
      </div>
      <!--搜索 及 操作栏-->
      <div class="dis-flex align-item-center" style="padding: 20px 0;">
        <img src="../../assets/images/search.png" style="width: 22px; margin-right: 15px;">
<!--        <Input search style="width: 270px;" enter-button="搜索" placeholder="搜索关键字"/>-->
        开始时间：
        <DatePicker value="startTime" type="datetime" placeholder="选择开始时间" @on-change="getStart" @on-ok="searchPriceData" style="width: 200px"></DatePicker>
        <span class="ml10">结束时间：</span>
        <DatePicker value="endTime" type="datetime" placeholder="选择结束时间" @on-change="getEnd" @on-ok="searchPriceData"  style="width: 200px"></DatePicker>
        <!--删除按钮-->
        <div style="margin-left: auto;">
          <Button type="success" size="small"
                  @click="$refs.rechargeBalance.showDialog()"
                  class="bg-6B71F3 common-bt mg-right-10" icon="ios-add">充值</Button>
        </div>
      </div>
    </Header>
    <template>
      <Table border :columns="orderColumns" :data="orderList">
        <template slot-scope="{ row }" slot="type">
          <strong>{{ row.type === '1'?'支出':'收入'}}</strong>
        </template>
        <template slot-scope="{ row }" slot="sourceType">
          <strong>{{ typeArr[row.sourceType-1] }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="show(row.id)">查看</Button>
        </template>
      </Table>
    </template>
    <template>
      <Page class-name="pagerPay" :current="parseInt(pageNumber)" :total="pagerTotal" :page-size="5" @on-change="changePager"/>
    </template>
  </Layout>
</template>

<script>
import TableControl from '@/components/table-control'
import RechargeBalanceDialog from '@/components/account/recharge-balance-dialog'
import {getUserBalance} from '../../api/module'
export default {
  name: 'finance-manage',
  components: {RechargeBalanceDialog, TableControl},
  data () {
    return {
      orderList: [{name: '你好啊'}], // 表格数据
      orderColumns: [ // 表头数据
        {title: '类型', slot: 'type'},
        {title: '金额(元)', key: 'money'},
        {title: '明细类型', slot: 'sourceType'},
        {title: '时间', key: 'createTime'}
        // {title: '操作', slot: 'action', key: 'name'}
      ],
      // 查询条件开始
      startTime: '',
      endTime: '',
      isPrice: 20,
      sourceType: null,
      type: null,
      pageNumber: '1',
      pageSize: '5',
      // 查询条件结束
      typeArr: [ // 明细类型名称
        '充值',
        '广告订单支付',
        '广告订单退款'
      ],
      pagerTotal: 50 // 分页器总页数
    }
  },
  mounted () {
    this.searchPriceData()
  },
  methods: {
    // 获取传过来的值
    searchPriceData () {
      getUserBalance({
        startTime: this.startTime,
        endTime: this.endTime,
        sourceType: this.sourceType,
        type: this.type,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
        this.orderList = res.rows
        this.pagerTotal = res.total
      })
    },
    // 查看详情
    show (id) {
      console.log(id)
      this.$router.push({
        path: '/order/detail',
        query: {
          id: id
        }
      })
    },
    // 页码改变
    changePager (data) {
      this.pageNumber = '' + data // 改变页码
      console.log(data, 'datadat', this.pageNumber)
      this.searchPriceData() // 再次搜索数据
    },
    // 获取开始时间
    getStart (time) {
      this.startTime = time
    },
    // 获取结束时间
    getEnd (time) {
      this.endTime = time
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
  .pagerPay {
    padding-top: 20px;
    text-align: center;
    background: #fff;
  }
  .ml10 {
    margin-left: 10px;
  }
</style>
