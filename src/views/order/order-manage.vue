<template>
  <Layout>
    <!--支付广告-->
    <pay-ad-dialog ref="payAd" :orderData="getOrder" @searchData="searchOrder"></pay-ad-dialog>
    <Header>
      <!--筛选按钮-->
      <div class="bg-6B71F3 filter-box dis-flex align-item-center">
        <button v-for="(item, inx) of filterList" class="button filter-bt"
                :class="{'active-filter': currentFilter === item.key}"
                :key="inx" @click="checkBtn(item.key)">{{item.title}}
        </button>
      </div>
      <!--搜索 及 操作栏-->
      <div class="dis-flex align-item-center" style="padding: 20px 34px;">
        <img src="../../assets/images/search.png" style="width: 22px; margin-right: 15px;">
        <Input v-model="name" search style="width: 270px;" enter-button="搜索" placeholder="搜索关键字" @on-search="searchBtn"/>

        <!--删除按钮-->
        <Button style="margin-left: auto;" icon="md-sync" type="success" @click="refresh">刷新</Button>
        <Button v-if="currentFilter === '2' || currentFilter === '7'" class="bg-EC3636" icon="md-trash" type="error" @click="allDelete">删除</Button>
      </div>
    </Header>
    <Content style="padding: 20px 34px;" class="bg-white overflow-a">
      <!--商品栏-->
      <table class="w-100b order-table">
        <tr>
          <th v-for="(item, inx) of orderColumns" :key="inx">
            <div class="mg-bottom-10">
              {{item.title}}
            </div>
          </th>
        </tr>

        <template v-for="(inx, index) in arr">
          <tr :key="index" style="background:rgba(238,239,255,1);height: 40px;line-height: 40px;">
            <td :colspan="orderColumns.length" style="padding-left: 32px;">
              <div>
                <Checkbox v-model="inx.isCheck"></Checkbox>
                {{getDatefn(inx.createTime)}} 订单号： {{inx.number}}

                <!--删除按钮-->
                <button v-if="currentFilter === '2' || currentFilter === '7'" class="button float-right mg-right-20" @click="deleteThis(inx.orderId)">
                  <Icon :size="19" color="#6B71F3" type="ios-trash-outline" />
                </button>
              </div>
            </td>
          </tr>
          <tr :key="index+'x'" class="info-box p8">
            <td>
<!--              <shop-ad-info class="mg-bottom-10" :shopInfo="shopData"></shop-ad-info>-->
            </td>
            <td class="color-666666">{{inx.advertisingSpaceName}}</td>
            <td class="color-666666">{{getDatefn(inx.startTime)}}~{{getDatefn(inx.endTime)}}</td>
            <td class="color-EC402F">￥{{inx.money}}</td>
            <td class="color-666666">{{inx.materielType}}</td>
            <td class="color-666666">{{currentFilter==='7'?inx.showNumber:inx.dayNumber}}</td>
            <td v-if="currentFilter==='3'" :class="['color-EC402F', 'color-28C24D', 'color-666666'][inx.orderState]">{{['待播放', '播放中', '已播放'][inx.orderState]}}</td>
            <td>
              <order-table-operating :current-filter="inx" :isShow="showBtn" @goToPay="goToPayData"></order-table-operating>
            </td>
          </tr>
        </template>
      </table>
      <template>
        <Page class-name="pagerPay" :current="parseInt(pageNumber)" :total="pagerTotal" :page-size="7" @on-change="changePager"/>
      </template>
    </Content>
  </Layout>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import DialogMixin from '@/mixins/dialog-mixin'
import ShopAdInfo from '@/components/shop-ad-info'
import OrderTableOperating from '@/components/order-table-operating'
import {orderList, deleteOrder} from '../../api/module'
import PayAdDialog from '@/components/index/pay-ad-dialog'
export default {
  name: 'order-manage',
  mixins: [DialogMixin],
  components: {OrderTableOperating, ShopAdInfo, PayAdDialog, DialogControl},
  data () {
    return {
      filterList: [
        {title: '待审核', key: '1'},
        {title: '待支付', key: '2'},
        {title: '已支付', key: '3'},
        {title: '未通过', key: '4'},
        // {title: '待评价', key: '5'},
        // {title: '已取消', key: '6'},
        {title: '已完成', key: '7'}
      ],
      currentFilter: '1',
      orderColumns: [
        {title: '订单'},
        {title: '广告位名称'},
        {title: '展示时间'},
        {title: '价格'},
        {title: '类型'},
        {title: '投放天数'},
        {title: '操作'}
      ],
      arr: null,
      // 查询条件开始
      name: null, // 搜索名字
      payState: null, // 支付状态 0：未支付 1：已支付 2：已退款
      auditState: 0, // 订单审核状态 0:未审核 1：审核通过 2：审核失败
      orderState: null, // 订单状态 0:未开始 1：展现中 2：展现结束
      orderPayId: null, // 订单号
      pageNumber: 1,
      pageSize: 7,
      // 查询条件结束
      shopData: null, // 商品信息传子组件
      showBtn: { // 是否显示的按钮
        isAudit: true, // 去审核
        isPay: false, // 去支付
        isAppraise: false, // 去评价
        isCancel: true, // 取消订单
        isCause: false, // 查看原因
        isDetail: true // 查看详情
      },
      pagerTotal: 20, // 分页器总页数
      getOrder: []
    }
  },
  mounted () {
    this.searchOrder() // 查询订单列表
  },
  methods: {
    // 点击切换订单状态
    checkBtn (ind) {
      if (this.orderColumns.length === 8) {
        this.orderColumns.splice(6, 1)
      }
      this.orderColumns[6].title = '投放天数'
      this.currentFilter = ind
      if (ind === '1') { // 待审核
        this.payState = null
        this.auditState = 0
        this.orderState = null
        this.orderPayId = null
        // 改变显示按钮
        this.showBtn.isAudit = true
        this.showBtn.isPay = false
        this.showBtn.isAppraise = false
        this.showBtn.isCancel = true
        this.showBtn.isCause = false
        this.showBtn.isDetail = true
      } else if (ind === '2') { // 待支付
        // 改变查询条件
        this.payState = 0
        this.auditState = null
        this.orderState = null
        this.orderPayId = null
        // 改变显示按钮
        this.showBtn.isAudit = false
        this.showBtn.isPay = true
        this.showBtn.isAppraise = false
        this.showBtn.isCancel = true
        this.showBtn.isCause = false
        this.showBtn.isDetail = true
      } else if (ind === '3') { // 已支付
        // 改变查询条件
        this.payState = 1
        this.auditState = null
        this.orderState = null
        this.orderPayId = null
        // 改变显示按钮
        this.showBtn.isAudit = false
        this.showBtn.isPay = false
        this.showBtn.isAppraise = false
        this.showBtn.isCancel = false
        this.showBtn.isCause = false
        this.showBtn.isDetail = true
        // 增加状态栏
        this.orderColumns.splice(5, 0, {title: '状态'})
      } else if (ind === '4') { // 未通过
        // 改变查询条件
        this.payState = null
        this.auditState = 2
        this.orderState = null
        this.orderPayId = null
        // 改变显示按钮
        this.showBtn.isAudit = false
        this.showBtn.isPay = false
        this.showBtn.isAppraise = false
        this.showBtn.isCancel = false
        this.showBtn.isCause = true
        this.showBtn.isDetail = false
      } else if (ind === '7') { // 已完成
        // 改变查询条件
        this.payState = null
        this.auditState = 2
        this.orderState = null
        this.orderPayId = null
        // 改变显示按钮
        this.showBtn.isAudit = false
        this.showBtn.isPay = false
        this.showBtn.isAppraise = false
        this.showBtn.isCancel = false
        this.showBtn.isCause = false
        this.showBtn.isDetail = true
        // 把展示天数改成播放量
        this.orderColumns[5].title = '播放总数'
      }
      this.searchOrder() // 再次搜索数据
    },
    // 查询订单
    searchOrder () {
      orderList({
        name: this.name,
        payState: this.payState, // 支付状态
        auditState: this.auditState, // 审核状态
        orderState: this.orderState, // 审核状态
        orderPayId: this.orderPayId,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }).then(res => {
        this.arr = res.rows
        this.pagerTotal = res.total
        console.log('res', res)
      })
    },
    // 返回时间日期yyyy-mm-dd
    getDatefn (data) {
      if (data) {
        return data.substring(0, 10)
      } else {
        return ''
      }
    },
    // 页码改变事件
    changePager (data) {
      this.pageNumber = '' + data // 改变页码
      console.log(data, 'datadat', this.pageNumber)
      this.searchOrder() // 再次搜索数据
    },
    // 搜索栏的搜索事件
    searchBtn () {
      this.pageNumber = 1
      this.searchOrder() // 再次搜索数据
    },
    // 去支付触发子组件事件
    goToPayData (data) {
      this.getOrder = []
      console.log('zidata', data)
      this.$refs.payAd.showDialog()
      this.getOrder.push(data)
    },
    // 删除当前的订单
    deleteThis (index) {
      console.log('删除的是', index)
      deleteOrder({
        orderId: index
      }).then(res => {
        console.log('返回的是', res)
        this.$Modal.success({
          title: '温馨提示：',
          content: '删除成功！'
        })
        this.searchOrder()
      })
    },
    // 删除选中的订单
    allDelete () {
      let orderStr = ''
      this.arr.map(item => {
        if (item.isCheck) {
          orderStr += item.orderId + ','
        }
      })
      if (orderStr === '') {
        this.$Modal.error({
          title: '温馨提示:',
          content: '您还未勾选任何订单!!'
        })
      } else {
        this.deleteThis(orderStr)
      }
    },
    // 刷新页面订单
    refresh () {
      this.searchOrder()
      this.$Message['success']({
        background: true,
        content: '刷新成功'
      })
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

  /*筛选容器*/
  .filter-box {
    height: 50px;
    padding: 10px 55px;
  }

  /*筛选按钮*/
  .filter-bt {
    color: white;
    padding: 0 14px;
    margin-right: 10px;
    text-align: center;
    height: 100%;
    line-height: 100%;

    /*选中的筛选*/

    &.active-filter {
      color: #6B71F3;
      border-radius: 6px;
      background-color: white;
    }
  }

  /*订单表格*/
  .order-table {
    border-collapse: separate;
    border-spacing: 0;

    th {
      div {
        color: #4D4D4D;
        height: 46px;
        line-height: 46px;
        background-color: white;
        border: 1px solid rgba(219, 219, 219, 1);
        border-right: none;
      }

      &:last-child {
        div {
          border-right: 1px solid rgba(219, 219, 219, 1);
        }
      }
    }

    .info-box td {
      vertical-align: middle;
      text-align: center;
    }
  }
  .color-EC402F {
    color: #EC402F;
  }
  .color-28C24D {
    color: #28C24D;
  }
  .pagerPay {
    width: 100%;
    text-align: center;
    background: #fff;
    margin-top: 30px;
  }
  .p8 {
    height: 40px;
  }
  .h-100b{
    overflow: auto !important;
  }
</style>
