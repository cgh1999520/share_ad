<template>
  <Layout class="h-100b">
    <!--购物车控件-->
    <shop-cart-dialog ref="shopCart"></shop-cart-dialog>

    <Header class="bg-white dis-flex align-item-center">
    <!--  <img src="../../assets/images/search.png" style="width: 22px; margin-right: 15px;">
      <Input search style="width: 270px;" enter-button="搜索" placeholder="搜索关键字"/>-->

      <!--右侧操作按钮-->
      <div style="margin-left: auto;" class="dis-flex">
<!--        <Button class="bg-6B71F3 mg-right-20 color-white">确定</Button>-->

        <!--广告类型切换容器-->
        <div class="ad-type-box">
          <router-link to="/index/map">
            <button class="active-bt button">地图</button>
          </router-link>
          <router-link to="/index/list">
            <button class=" button">列表</button>
          </router-link>
        </div>
      </div>

    </Header>
    <Content class="bg-white pos-relative dis-flex flex-column" style="padding: 10px 32px;height: 0;">

      <!--购物车 按钮-->
      <Badge :count="getAdShoppingCartList.length" class="cart-bt">
        <Button type="primary"
                @click="$refs.shopCart.showDialog()" shape="circle" class="bg-6B71F3"
                icon="md-cart"></Button>
      </Badge>

      <!--筛选栏-->
      <div class="filter-box mg-bottom-10">
        <div v-for="(item, inx01) of filterList" :key="inx01" class="dis-flex filter-content" style="color: #4D4D4D;">
          {{item.title}}:
          <!--通用筛选项-->
          <div class="filter-item mg-left-20">
                       <span v-for="(filter, inxf) of getIndexFilterData[item.filterKey]"
                             :key="inxf"
                             @click.stop="filterAd(item, filter)"
                             :class="{'active-item' :formData[item.filterKey] === filter}"
                             class="filter-content-item">{{filter}}</span>
            <!--城市筛选-->
            <template v-if="['province','city','area'].indexOf(item.key) !== -1">
                 <span v-for="(lat, inxl) of getLocationList(item.key)"
                       :key="inxl"
                       :class="{'active-item' :formData[item.key + 'Id'] === lat.id}"
                       @click.stop="selectLocation(item, lat)"
                       class="filter-content-item">{{lat.name}}</span>
            </template>
            <!--价格筛选-->
            <template v-if="item.key === 'price'">
              <div class="dis-flex align-item-center">
                <Input v-model="formData.minMoney" v-enter-number class="w-100 mg-right-10"></Input>  -
                <Input v-model="formData.maxMoney" v-enter-number class="w-100 mg-left-10"></Input>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!--广告列表-->
      <div class="mg-top-10 hidden-scroll flex-1 ad-list-box">
        <div v-for="ad of adList" :key="ad.id" style="justify-content: space-between;"
             class="ad-info-item dis-flex align-item-center">
          <shop-ad-info :shop-info="ad"></shop-ad-info>
          <!--广告投放信息-->
          <div class="color-808080 dis-flex" style="margin-top: 24px">
            <div>
              <span class="color-EC402F">{{ad.equipmentNum}}</span>块屏
            </div>
            <div class="serving-count">{{ad.advMechanism}}</div>
            <div>{{ad.avgNumber}}受众</div>
          </div>
          <div>
            <Button class="bg-F05151"
                    :disabled="isBeingShoppingCart(ad)"
                    @click="addAdShoppingCart(ad)"
                    type="error">{{isBeingShoppingCart(ad) ? '已加入': '加入'}}</Button>
          </div>
        </div>
      </div>
    </Content>
  </Layout>
</template>

<script>
import ShopAdInfo from '@/components/shop-ad-info'
import ServingDialog from '@/components/index/serving-dialog'
import ShopCartDialog from '@/components/index/shop-cart-dialog'
import {mapActions, mapGetters} from 'vuex'
import lodash from 'lodash'
import {getIndexPointData} from '@/api/module'

export default {
  name: 'index-list',
  components: {ShopCartDialog, ServingDialog, ShopAdInfo},
  data () {
    return {
      filterList: [
        {title: '省', key: 'province'},
        {title: '市', key: 'city'},
        {title: '区', key: 'area'},
        {title: '价格', key: 'price'},
        {title: '屏幕类型', key: 'screen-type', filterKey: 'equipmentScreenType'},
        {title: '屏幕场所', key: 'screen-location', filterKey: 'equipmentTwoScene'},
        {title: '广告位类型', key: 'ad-space', filterKey: 'positionType'},
        {title: '物料类型', key: 'materials', filterKey: 'materielType'},
        {title: '分辨率', key: 'resolution', filterKey: 'screenResolution'},
        {title: '尺寸', key: 'size', filterKey: 'screenSize'}
      ],
      adList: [], // 点位数据
      locationInfo: {
        province: {},
        city: {},
        area: {}
      },
      formData: { //
        equipmentScreenType: '',
        equipmentTwoScene: '',
        positionType: '',
        materielType: '',
        screenResolution: '',
        screenSize: '',
        minMoney: '',
        maxMoney: '',
        lat: '',
        lng: '',
        radius: '100000',
        provinceId: '',
        cityId: '',
        areaId: '',
        advertisingPositionId: ''
      }
    }
  },
  computed: {
    ...mapGetters(['getCityList', 'getIndexFilterData', 'getAdShoppingCartList'])
  },
  watch: {
    'formData.minMoney' () {
      this.getAdPointData()
    },
    'formData.maxMoney' () {
      this.getAdPointData()
    }
  },
  methods: {
    ...mapActions(['addAdShoppingCart']),
    /**
     * @Description: 是否存在购物车
     * @date 2019/9/20  17:08
     */
    isBeingShoppingCart (ad) {
      return this.getAdShoppingCartList.findIndex(item => item.id === ad.id) !== -1
    },
    /**
       * @Description: 筛选广告
       * @date 2019/9/11  14:59
       */
    filterAd (event, val) {
      let oldVal = this.formData[event.filterKey]
      if (oldVal === val) {
        this.formData[event.filterKey] = null
      } else {
        this.formData[event.filterKey] = val
      }
      this.getAdPointData()
    },
    /**
       * @Description: 选择地址
       * @date 2019/9/12  10:39
       */
    selectLocation (event, val) {
      // 当选择不同地址时，复位对应市区数据
      if (event.key === 'province') {
        this.locationInfo.city = []
        this.locationInfo.area = []
        this.formData.cityId = ''
        this.formData.areaId = ''
      } else if (event.key === 'city') {
        this.locationInfo.area = []
        this.formData.areaId = ''
      }
      this.formData[event.key + 'Id'] = val.id
      this.locationInfo[event.key] = val
      this.getAdPointData()
    },
    /**
       * @Description: 获取城市列表
       * @date 2019/9/11  16:51
       */
    getLocationList (key) {
      if (key === 'city') {
        return this.locationInfo.province.id ? this.locationInfo.province.list : []
      } else if (key === 'area') {
        return this.locationInfo.city.id ? this.locationInfo.city.list : []
      }
      return this.getCityList
    },
    /**
       * @Description: 获取广告点位数据
       * @date 2019/9/11  15:23
       */
    getAdPointData: lodash.debounce(function () {
      getIndexPointData(this.formData).then(res => {
        this.adList = res.AdvList
      })
    }, 600)
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-layout-header {
    padding: 10px 35px;
    line-height: initial;
  }

  /deep/ .ivu-input, /deep/ .ivu-select-selection {
    border: 1px solid #6B71F3 !important;
  }

  /deep/ .ivu-input-search {
    background-color: #6B71F3 !important;
    border-color: #6B71F3 !important;
  }

  /*广告类型容器*/
  .ad-type-box {
    margin-left: auto;
    border-radius: 6px;
    border: 1px solid #6B71F3;

    button {
      width: 64px;
      height: 100%;
      border-radius: 0px 6px 6px 0px;
      line-height: 30px;
      text-align: center;
      color: #6B71F3;
      background-color: white;
    }

    .active-bt {
      color: white;
      border-radius: 6px 0px 0px 6px;
      background-color: #6B71F3;
    }
  }

  /*广告Item*/

  .ad-info-item {
    padding: 10px 33px;
    border-bottom: 1px solid rgba(204, 204, 204, 1);

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

  /* 筛选栏 容器*/
  .filter-box {
    padding: 17px 29px;
    overflow-y: auto;
    border: 1px solid #DBDBDB;

    /*筛选内容*/
    .filter-content {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #DBDBDB;
    }

    /*筛选 Item*/

    .filter-content-item {
      color: #808080;
      font-size: 12px;
      margin-left: 15px;
      margin-bottom: 10px;
      cursor: pointer;
      /*选中 Item */
      &.active-item {
        color: #6B71F3;
      }
    }
  }

  /*购物车按钮*/
  .cart-bt {
    position: absolute;
    z-index: 1;
    right: 80px;
    bottom: 132px;

    button {
      width: 45px;
      height: 45px;
      border: none;
      background: rgba(107, 113, 243, 1);
      box-shadow: 0px 0px 8px 0px rgba(0, 36, 255, 1);
      border-radius: 50%;
    }
  }

  /*广告列表容器*/
  .ad-list-box {
    overflow-y: auto;
    border: 1px solid #DBDBDB;
  }
</style>
