<template>
    <div class="ad-info-item">
      <shop-ad-info :shop-info="ad">
        <Button class="bg-F05151 pos-absolute"
                @click="addAdOrRemoveAd"
                type="error" style="right: 0;bottom: 5px;">{{isBeingShoppingCart ? '移除' :'加入'}}</Button>
      </shop-ad-info>
      <!--广告投放信息-->
      <div class="w-100b color-808080 dis-flex" style="margin-top: 24px">
        <div>
          <span class="color-EC402F">{{ad.equipmentNum}}</span>块屏
        </div>
        <div class="serving-count">{{ad.advMechanism}}</div>
        <div>{{ad.avgNumber}}受众</div>
      </div>
    </div>
</template>

<script>
import ShopAdInfo from '@/components/shop-ad-info'
import {mapActions, mapGetters} from 'vuex'

export default {
  name: 'ad-item',
  props: {
    ad: {
      required: true
    }
  },
  computed: {
    ...mapGetters(['getAdShoppingCartList']),
    /**
     * @Description: 是否存在购物车
     * @date 2019/9/20  17:08
     */
    isBeingShoppingCart () {
      return this.getAdShoppingCartList.findIndex(item => item.id === this.ad.id) !== -1
    }
  },
  components: {ShopAdInfo},
  methods: {
    ...mapActions(['addAdShoppingCart', 'removeAdShoppingCart']),
    /**
      * @Description: 添加/移除广告
      * @date 2019/9/26
      */
    addAdOrRemoveAd () {
      if (this.isBeingShoppingCart) {
        this.removeAdShoppingCart(this.ad)
      } else {
        this.addAdShoppingCart(this.ad)
      }
    }
  }
}
</script>

<style scoped lang="less">
  /*广告Item*/

  .ad-info-item {
    padding: 10px 33px;

    /*投放量*/

    .serving-count {
      padding-left: 28px;
      padding-right: 28px;
      margin-left: 28px;
      margin-right: 28px;
      border-right: 2px solid #B3B3B3;
      border-left: 2px solid #B3B3B3;
    }
  }
</style>
