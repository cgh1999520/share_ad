<template>
  <Layout>
    <Header>
      <Button icon="ios-arrow-back"
              @click="$router.go(-1)"
              type="success" class="back-bt h-100b">订单详情
      </Button>
    </Header>
    <Content style="padding: 50px 130px;">
      <div style="color: #656565;font-size: 15px;">
        <span style="width: 9px;height: 9px;" class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
        展现量

        日期选择器
        <div class="float-right date-select">
          <DatePicker :value="startTime" class="date-item" placeholder="请选择开始时间" @on-change="getStart"></DatePicker>
          <span style="width: 14px;height: 2px;" class="dis-inline-block"></span>
          <DatePicker :value="endTime" class="date-item" placeholder="请选择结束时间" @on-change="getEnd"></DatePicker>
        </div>
      </div>
      <display-volume :data_u="getArray()" :columns_u="['time','playNumber']"></display-volume>
      <!-- table 控件 -->
      <div class="data_order f18">
        <div v-for="(item, index) in tableColumns" :key="index">
          <template v-if="item.key==='orderCreateType'">
            <span>{{item.title}}</span>：<span class="mr50">{{tableData[item.key]==0?'自己创建':'子账号创建'}}</span>
          </template>
          <template v-else-if="item.key === 'deliveryStrategy'">
            <span>{{item.title}}</span>：<span class="mr50">{{tableData[item.key]==0?'平均投放':'不限制投放'}}</span>
          </template>
          <template v-else-if="item.key === 'auditState'">
            <span>{{item.title}}</span>：<span class="mr50">{{['未审核', '审核通过', '审核失败'][tableData[item.key]]}}</span>
          </template>
          <template v-else-if="item.key === 'orderState'">
            <span>{{item.title}}</span>：<span class="mr50">{{['未开始', '展现中', '展现结束'][tableData[item.key]]}}</span>
          </template>
          <template v-else-if="item.key === 'payState'">
            <span>{{item.title}}</span>：<span class="mr50">{{['未支付', '已支付', '已退款'][tableData[item.key]]}}</span>
          </template>
          <template v-else>
            <span>{{item.title}}</span>：<span class="mr50">{{tableData[item.key] || '无'}}</span>
          </template>
        </div>
      </div>
<!--      <table-control-->
<!--        :data="tableData"-->
<!--        :columns="tableColumns"-->
<!--        :stripe="true" :page="false"-->
<!--      >-->
<!--      </table-control>-->
    </Content>
  </Layout>
</template>

<script>
import TableControl from '@/components/table-control'
import DisplayVolume from '@/components/display-volume'
import {getOrderDetail} from '../../api/module'

export default {
  name: 'order-detail',
  components: {DisplayVolume, TableControl},
  data () {
    return {
      tableColumns: [
        {key: 'createTime', title: '创建时间'},
        {key: 'orderCreateType', title: '订单创建类型'}, // 订单创建类型 0：自己创建 1：子账号创建
        {key: 'deliveryStrategy', title: '投放策略'}, // 投放策略 0：平均投放 1：不限制投放
        {key: 'money', title: '金额'},
        {key: 'auditState', title: '审核状态'},
        {key: 'orderState', title: '订单状态 '},
        {key: 'payState', title: '支付状态'},
        {key: 'advertisingSpaceName', title: '广告位名称'},
        {key: 'number', title: '订单编号'},
        {key: 'provinces', title: '省'},
        {key: 'citys', title: '市'},
        {key: 'areas', title: '区县'},
        {key: 'startTime', title: '开始时间'},
        {key: 'endTime', title: '结束时间'},
        {key: 'dayNumber', title: '展现天数'},
        {key: 'showNumber', title: '展现数量'},
        {key: 'dayNumber', title: '展现天数'},
        {key: 'cpmNumber', title: 'cpm数量'},
        {key: 'remark', title: '备注'}
      ],
      tableData: [
        {date: '', city: '暂时没有数据', baoguang: 0}
      ],
      id: this.$route.query.id || null, // 获取路由传过来的明细id
      startTime: '',
      endTime: ''
    }
  },
  mounted () {
    console.log('传过来的id', this.$route.path)
    this.searchOrderDetail()
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        const that = this
        console.log(val)
        if (val.path === '/order/detail') {
          that.id = val.query.id
          that.searchOrderDetail()
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {
    // 搜索订单详情
    searchOrderDetail () {
      getOrderDetail({
        orderId: this.$route.query.id,
        startTime: this.startTime === '' ? null : this.startTime,
        endTime: this.endTime === '' ? null : this.endTime
        // orderId: '0d658cd28d51408fbf77aff477162c39'
      }).then(res => {
        console.log('resdetail', res)
        this.tableData = res || null
      })
    },
    // 处理图标数据
    getArray () {
      if (this.tableData != null) {
        return this.tableData.dailyDeliveryList
      } else {
        return []
      }
    },
    // 时间选择器 选择开始时间
    getStart (data) {
      this.startTime = data
      this.searchOrderDetail() // 执行搜索
    },
    // 选择结束时间
    getEnd (data) {
      this.endTime = data
      this.searchOrderDetail() // 执行搜索
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-table th, /deep/ .ivu-table tr:nth-child(2n) td {
    background-color: #EEEFFF;
  }

  /deep/ .ivu-layout-header {
    padding: 11px 34px;
    background-color: #6B71F3;
  }

  /deep/ .ivu-date-picker-rel .ivu-input {
    text-align: center;
    font-size: 14px;
    color: #808080;
  }

  /*返回按钮*/
  .back-bt {
    background: none !important;
    border: none !important;
  }

  /*日期 选择器i*/
  .date-select {
    display: flex;
    align-items: center;

    span {
      background-color: #DBDBDB;
      margin: auto 6px;
    }

    .date-item {
      width: 122px;
      height: 28px;

    }
  }
  .data_order{
    display: flex;
    flex-wrap: wrap;
    div{
      width: 25%;
      font-size: 18px !important;
    }
  }
  .mr50{
    margin-right: 50px;
  }
</style>
