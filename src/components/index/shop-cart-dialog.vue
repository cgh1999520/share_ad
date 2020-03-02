<template>
  <dialog-control
    title="购物车"
    width="60%"
    @close="closeDialog"
    v-model="isShowDialog"
  >
    <!--支付广告-->
    <pay-ad-dialog ref="payAd" :orderData="getOrder"></pay-ad-dialog>
    <!--投放控件-->
    <serving-dialog ref="servingAd"></serving-dialog>

    <Card>
      <div class="color-4D4D4D mg-bottom-10">订单列表</div>
      <Button type="success" size="small"
              :disabled="isSelectNotServingAd"
              @click="orderSelectAd(selectAd)"
              class="mg-right-10" icon="ios-create">下单
      </Button>
      <Button type="info" size="small"
              @click="addOrder" icon="ios-add">添加
      </Button>
      <Button type="error" size="small"
              @click="removeThisOrder(selectAd)"
              class="bg-F05151" icon="ios-trash">移除
      </Button>

      <!--表格控件-->
      <table-control
        :data="getAdShoppingCartList"
        @selectChange="selectAd = $event"
        class="mg-top-10"
        :page="false"
        :columns="orderColumns">
        <template slot-scope="{row}">
          <Button :type="row.order === undefined ? 'success' : 'warning'" size="small"
                  @click="$refs.servingAd.servingAd(row)"
                  class="mg-right-10"
                  icon="ios-create">{{row.order === undefined ? '投放': '编辑'}}
          </Button>
          <Button type="error" size="small"
                  @click="removeThisOrder(row)"
                  class="bg-F05151" icon="ios-trash">移除
          </Button>
        </template>
      </table-control>
    </Card>
  </dialog-control>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import TableControl from '@/components/table-control'
import DialogMixin from '@/mixins/dialog-mixin'
import {mapActions, mapGetters} from 'vuex'
import ServingDialog from './serving-dialog'
import PayAdDialog from './pay-ad-dialog'
import {servingAdOrder} from '../../api/module'

export default {
  name: 'shop-cart-dialog',
  mixins: [DialogMixin],
  components: {PayAdDialog, ServingDialog, TableControl, DialogControl},
  data () {
    return {
      selectAd: [],
      orderColumns: [
        {
          type: 'selection',
          width: 60
        },
        {title: '名称', key: 'equipmentName'},
        {title: '尺寸', key: 'screenSize'},
        {title: '金额', key: 'floorPrice', filterRemote: val => '￥ ' + val},
        {title: '类型', key: 'materielType'},
        {title: '操作', slot: 'operating', width: 200}
      ],
      getOrder: []
    }
  },
  computed: {
    ...mapGetters(['getAdShoppingCartList']),
    /**
             * @Description: 是否选择未投放的广告
             * @date 2019/9/26
             */
    isSelectNotServingAd () {
      return this.selectAd.findIndex(item =>
        item.order === undefined) !== -1 || this.selectAd.length === 0
    }
  },
  methods: {
    ...mapActions(['removeAdShoppingCart']),
    /**
             * @Description: 下单选择的广告
             * @date 2019/9/27
             */
    orderSelectAd (ad) {
      const ads = ad instanceof Array ? ad : [ad]
      servingAdOrder({
        list: ads.map(item => item.order)
      }).then(res => {
        this.getOrder = res
        this.$refs.payAd.showDialog()
        console.log('res下单信息', res)
      })
    },
    /**
     * @Description: 跳转首页添加订单
     * @author LC
     * @date 2019/10/22
    */
    addOrder () {
      this.closeDialog()
      this.$emit('leftPart')
    },
    // 点击移除
    removeThisOrder (row) {
      let that = this
      this.$Modal.confirm({
        title: '温馨提示',
        content: '确定移除订单么？',
        onOk: function () {
          console.log('真的删除了')
          that.selectAd = []
          that.removeAdShoppingCart(row)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
