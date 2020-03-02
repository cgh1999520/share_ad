<template>
  <div class="shop-info-box">
    <div class="dis-flex flex-column justify-content-center" style="text-align: left;">
      <div class="color-666666 omit" style="width: 284px">{{ shopInfo.equipmentName || '' }}</div>
      <div class="color-EC402F mg-top-10 mg-bottom-10">￥{{shopInfo.floorPrice || '' }}</div>
      <div class="color-808080">类型：{{shopInfo.equipmentScreenType || '' }}</div>
      <div class="color-808080">分辨率：{{shopInfo.screenResolution || '' }}</div>
      <div class="color-808080">尺寸：{{shopInfo.screenSize || '' }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'shop-ad-info',
  props: {
    shopInfo: { // 广告信息
      required: true
    }
  }
}
</script>

<style scoped lang="less">

  /*订单信息容器*/

  .shop-info-box {
    display: flex;
    position: relative;
    align-items: center;

    /*商品图片*/

    .shop-img {
      width: 94px;
      height: 88px;
    }
  }
</style>
