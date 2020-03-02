<template>
  <div>
<!--    <Button v-if="isShow.isAudit" size="small" type="success" class="bg-28C24D" @click="replay">去审核</Button>-->
    <Button v-if="isShow.isPay" size="small" type="success" class="bg-28C24D" @click="goPay">去支付</Button>
    <Button v-if="isShow.isAppraise" size="small" type="success" class="bg-28C24D" @click="replay">去评价</Button>
  <!--  <Button size="small" type="success" class="bg-28C24D">去审核</Button>
    <Button size="small" type="success" class="bg-28C24D">去支付</Button>
    <Button size="small" type="success" class="bg-28C24D">去评价</Button>
    <Button size="small" type="error" class="bg-F05151">取消订单</Button>-->
    <Button v-if="isShow.isCause" size="small" type="error"  class="bg-F05151" @click="replay">查看原因</Button>
<!--    <Button v-if="isShow.isCancel" size="small" type="error"  class="bg-F05151" @click="replay">取消订单</Button>-->
    <Button v-if="isShow.isDetail" size="small" class="bg-6B71F3 color-white" @click="toDetail">订单详情</Button>
  </div>
</template>

<script>
export default {
  name: 'order-table-operating',
  props: {
    currentFilter: Object, // 传过来的订单号
    isShow: Object // 显示的按钮
  },
  methods: {
    // 再次投放
    replay () {
      console.log('id', this.currentFilter)
    },
    toDetail () {
      this.$router.push({
        path: '/order/detail',
        query: {
          id: this.currentFilter.id
        }
      })
    },
    goPay () {
      this.$emit('goToPay', this.currentFilter)
    }
  }
}
</script>

<style scoped>

</style>
