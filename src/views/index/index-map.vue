<template>
  <Layout class="h-100b">
    <!--购物车控件-->
    <shop-cart-dialog ref="shopCart" @leftPart="openLeft"></shop-cart-dialog>

    <Header class="bg-6B71F3 filter-box dis-flex align-item-center">
      <!--筛选按钮-->
      <div v-for="(item, inx) of filterList" class="button filter-bt"
          :class="{'active-filter': currentFilter === item.key}"
          :key="inx">
        <div @click.stop="selectFilter(item.key)">
          {{item.title}}
          <Icon type="md-arrow-dropdown-circle"/>
        </div>
        <!--通用筛选项-->
        <div class="filter-content-box" v-show="currentFilter === item.key">
          <template v-if="item.filterKey">
              <span v-for="(filter, inxf) of getIndexFilterData[item.filterKey]"
                    :key="inxf"
                    @click.stop="filterAd(item, filter)"
                    :class="{'active-item': formData[item.filterKey] === filter}"
                    class="filter-content-item">{{filter}}</span>
              <span v-if="['province','city','area'].indexOf(currentFilter) === -1" @click.stop="filterAd(item, '全部')"
                    :class="{'active-item': formData[item.filterKey] === ' '}"
                    class="filter-content-item">全部</span>
          </template>
          <template v-else>
            <!--价格筛选-->
            <template v-if="currentFilter === 'price'">
              <div class="dis-flex align-item-center">
                <Input v-model="formData.minMoney" v-enter-number class="w-100"></Input> -
                <Input v-model="formData.maxMoney" v-enter-number class="w-100"></Input>
              </div>
            </template>
            <!--城市筛选-->
            <template v-if="['province','city','area'].indexOf(currentFilter) !== -1">
            <span v-for="(lat, inxl) of getLocationList"
                  :key="inxl"
                  @click.stop="selectLocation(item, lat)"
                  class="filter-content-item">{{lat.name}}</span>
            </template>
          </template>
        </div>
      </div>

      <!--广告类型切换容器-->
      <div class="ad-type-box">
        <router-link to="/index/map">
          <button class="button">地图</button>
        </router-link>
        <router-link to="/index/list">
          <button class="active-bt button">列表</button>
        </router-link>
      </div>
    </Header>
    <Content class="pos-relative">

      <!--购物车 按钮-->
      <Badge :count="getAdShoppingCartList.length" class="cart-bt">
        <Button type="primary" shape="circle" @click="showChat" class="bg-6B71F3"
                icon="md-cart"></Button>
      </Badge>

      <!--广告列表-->
      <div class="h-100b ad-content-box" :class="{'hide': isHideAdNav}">
        <div class="ad-list-box">
          <!--展开收拢按钮-->
          <button class="receive-bt button" @click="isHideAdNav = !isHideAdNav">
            <img style="width: 7px;height: 13px;"
                 :src=" isHideAdNav ? require('../../assets/images/right.png')
                 : require('../../assets/images/left.png')">
          </button>

          <!--广告列表-->
          <div class="flex-1 hidden-scroll" style="overflow-y: auto;">
            <ad-item style="border-bottom: 1px solid rgba(204, 204, 204, 1);"
                     v-for="item of adList" :key="item.id"
                     :ad="item"></ad-item>
          </div>
          <!--底部操作-->
          <div class="footer" style="padding: 10px 32px;">
            <Checkbox :value="isSelectAllAd"
                       class="float-right mg-top-10"
                      @on-change="selectAllAdChange">全选
            </Checkbox>
          </div>
        </div>
      </div>

      <!--地图控件-->
      <el-amap-search-box class="search-box" :search-option="mapConfig.searchOption" :on-search-result="onSearchResult"></el-amap-search-box>
      <el-amap vid="amap" ref="aMap" :amap-manager="mapConfig.amapManager"
              :center="mapConfig.center" :zoom="mapConfig.zoom"
              :plugin="mapConfig.plugin" :events="mapConfig.events" class="amap-box">
        <!--坐标点-->

        <el-amap-circle v-for="circle in mapConfig.circles" :center="circle.center" :radius="circle.radius" :fill-opacity="circle.fillOpacity" :events="circle.events" :key="circle.radius"></el-amap-circle>
        <el-amap-marker v-for="(marker, inx) in mapConfig.markers"
                        :key="inx"
                        :title="marker.title"
                        :content="marker.content"
                        :events="marker.events"
                        :position="marker.position"></el-amap-marker>
      </el-amap>
    </Content>
  </Layout>
</template>

<script>
import * as VueAMap from 'vue-amap'
import ShopAdInfo from '@/components/shop-ad-info'
import AdItem from '@/components/index/ad-item'
import ShopCartDialog from '@/components/index/shop-cart-dialog'
import ServingDialog from '@/components/index/serving-dialog'
import {mapActions, mapGetters} from 'vuex'
import lodash from 'lodash'
import {getIndexAdInfoList, getIndexLevelData, getIndexPointData} from '@/api/module'

export default {
  name: 'index-map',
  components: {ServingDialog, ShopCartDialog, AdItem, ShopAdInfo},
  data () {
    let self = this
    return {
      isHideAdNav: true, // 隐藏 广告导航栏
      mapConfig: {
        amapManager: undefined,
        zoom: 12,
        position: [],
        center: [121.59996, 31.197646],
        circles: [
          {
            center: [121.5273285, 31.21515044],
            radius: 13000,
            fillOpacity: 0.1,
            strokeWeight: 0.1,
            strokeOpacity: 0.1,
            events: {
              click: () => {
                // alert('click')
              }
            }
          }
        ],
        searchOption: {
          city: '上海',
          citylimit: true
        },
        loaded: false,
        plugin: [
          {
            pName: 'ToolBar',
            position: 'RT',
            noIpLocate: true,
            autoPosition: true,
            useNative: true,
            direction: false,
            defaultType: 0
          },
          {
            pName: 'Geolocation',
            events: {
              init (o) {
                // o 是高德地图定位插件实例
                o.getCityInfo((status, result) => {
                  // console.log(result, '----')
                  if (result && result.center) {
                    self.mapConfig.center = result.center
                    self.mapConfig.circles[0].center = result.center
                    self.mapConfig.loaded = true
                    self.mapConfig.searchOption.city = result.city
                    self.$nextTick()
                  }
                })
              }
            }
          }
        ],
        events: {
          zoomend: this.getAdList, // 地图缩放结束
          moveend: this.getAdList, // 地图移动结束
          mousewheel (e) {
            // console.log('eee', e)
            let psn = e.lnglat
            // let pix = e.pixel
            let lng = psn.lng
            let lat = psn.lat
            // let radius = pix.y * 25
            self.formData.lng = lng
            self.formData.lat = lat
            // self.formData.radius = radius
            // self.mapConfig.circles[0].radius = radius
            self.getAdPointData()
          },
          'click': (e) => {
            self.formData.lng = e.lnglat.lng
            self.formData.lat = e.lnglat.lat
            self.mapConfig.center = [e.lnglat.lng, e.lnglat.lat]
            self.mapConfig.circles[0].center = [e.lnglat.lng, e.lnglat.lat]
            self.getAdPointData()
          }
        },
        markers: []
      },
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
        radius: '13000',
        provinceId: '',
        cityId: '',
        areaId: '',
        advertisingPositionId: ''
      },
      currentFilter: ''
    }
  },
  created () {
    this.initMapConfig()
    this.updateCityList()
    this.updateShoppingCart()
    this.updateIndexFilterData()
  },
  mounted () {
    this.getAdList()
  },
  computed: {
    ...mapGetters(['getCityList', 'getIndexFilterData', 'getAdShoppingCartList']),
    /**
             * @Description: 获取城市列表
             * @date 2019/9/11  16:51
             */
    getLocationList () {
      if (this.currentFilter === 'city') {
        return this.locationInfo.province.id ? this.locationInfo.province.list : []
      } else if (this.currentFilter === 'area') {
        return this.locationInfo.city.id ? this.locationInfo.city.list : []
      }
      return this.getCityList
    },
    /**
             * @Description: 是否选择全部广告
             * @date 2019/9/26
             */
    isSelectAllAd () {
      // 在购物车中，查找当前的广告，如果有广告在购物车中未找到则说明没有全选广告
      const ids = this.getAdShoppingCartList.map(item => item.id)
      for (let ad of this.adList) {
        if (ids.indexOf(ad.id) === -1) return false
      }
      return true
    }
  },
  watch: {
    'formData.minMoney' () {
      this.getAdList()
    },
    'formData.maxMoney' () {
      this.getAdList()
    }
  },
  methods: {
    ...mapActions(['updateCityList', 'updateIndexFilterData', 'addAdShoppingCart', 'removeAdShoppingCart', 'updateShoppingCart']),
    // 添加标点
    addMarker: function () {
      let lng = 121.5 + Math.round(Math.random() * 1000) / 10000
      let lat = 31.197646 + Math.round(Math.random() * 500) / 10000
      this.mapConfig.markers.push([lng, lat])
    },
    // 地图组件搜索板块
    onSearchResult (pois) {
      // console.log('pois', pois)
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          let {lng, lat} = poi
          lngSum += lng
          latSum += lat
          // this.mapConfig.markers.push([poi.lng, poi.lat])
        })
        let center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.mapConfig.center = [center.lng, center.lat]
        this.mapConfig.circles[0].center = [center.lng, center.lat]
      }
    },
    /**
             * @Description: 选择全部广告/取消选择全部广告
             * @date 2019/9/26
             */
    selectAllAdChange (event) {
      if (event) {
        this.addAdShoppingCart(this.adList)
      } else {
        this.removeAdShoppingCart(this.adList)
      }
    },
    /**
             * @Description: 筛选广告
             * @date 2019/9/11  15:02
             */
    selectFilter (key) {
      this.currentFilter = key === this.currentFilter ? '' : key
    },
    /**
             * @Description: 筛选广告
             * @date 2019/9/11  14:59
             */
    filterAd (event, val) {
      // event.title = val
      if (val === '全部') {
        this.formData[event.filterKey] = ' '
      } else {
        this.formData[event.filterKey] = val
      }
      this.getAdList()
    },
    /**
             * @Description: 选择地址
             * @date 2019/9/12  10:39
             */
    selectLocation (event, val) {
      let zoom = {
        province: '7',
        city: '11',
        area: '15'
      }
      // 当选择不同地址时，复位对应市区数据
      if (event.key === 'province') {
        this.locationInfo.city = []
        this.locationInfo.area = []
        this.formData.cityId = ''
        this.formData.areaId = ''
        this.filterList.map(item => {
          if (item.key === 'city' || item.key === 'area') item.title = ''
          return item
        })
      } else if (event.key === 'city') {
        this.locationInfo.area = []
        this.formData.areaId = ''
        this.filterList.map(item => {
          if (item.key === 'area') item.title = ''
          return item
        })
      }
      event.title = val.name
      this.formData[event.key + 'Id'] = val.id
      this.locationInfo[event.key] = val
      this.mapConfig.zoom = zoom[event.key]
      this.mapConfig.center = [val.lng, val.lat]
      this.getAdList()
    },
    /**
             * @Description: 获取广告列表
             * @date 2019/9/11  15:07
             */
    getAdList: lodash.debounce(function (e) {
      // 判断当前的缩放层级
      const map = this.mapConfig.amapManager.getMap()
      const zoom = map.getZoom()
      let level = ''
      if (zoom >= 11 && zoom < 13) {
        level = 'city'
      } else if (zoom >= 7 && zoom < 11) {
        level = 'province'
      } else if (zoom >= 3 && zoom < 7) {
        level = 'country'
      }
      // 如果存在层级，则获取广告分层，相反获取点位数据
      this.adList = []
      if (level) {
        this.getAdLevelData(level)
      } else {
        // 获取半径距离
        /*  const bounds = map.getBounds()
                            const distance = window.AMap.GeometryUtil.distance(
                              bounds.getNorthEast(), //  获取东北角坐标
                              bounds.getSouthEast()) // 获取西南角坐标 */
        const location = this.$refs.aMap.$$getCenter()
        this.formData.lng = location[0]
        this.formData.lat = location[1]
        // this.formData.radius = parseInt(distance / 2)
        this.getAdPointData()
      }
    }, 300),

    /**
             * @Description: 获取广告层级数据
             * @date 2019/9/11  15:23
             */
    getAdLevelData (level) {
      let location = this.$refs.aMap.$$getCenter()
      getIndexLevelData({
        hierarchy: level,
        lng: location[0],
        lat: location[1]
      }).then(res => {
        // 初始化坐标点
        this.mapConfig.markers = res.map(item => {
          item.position = [item.wgLon, item.wgLat]
          item.content =
                            `<div class="level-marker">
              <p>${item.name}</p>
              <p>点位：${item.shopNum}</p>
              <p>屏幕：${item.screenNum}</p>
            </div>`
          item.title = item.name
          item.events = {
            click: () => {
              const map = this.mapConfig.amapManager.getMap()
              this.mapConfig.center = item.position
              this.mapConfig.zoom = map.getZoom() + 3
            }
          }
          return item
        })
      })
    },

    /**
             * @Description: 获取广告点位数据
             * @date 2019/9/11  15:23
             */
    getAdPointData () {
      getIndexPointData(this.formData).then(res => {
        // console.log(res.AdvList, 'res.AdvList')
        this.adList = res.AdvList
        this.mapConfig.markers = res.shopList.map(item => {
          item.position = [item.wgLon, item.wgLat]
          item.content =
                            `<div class="point-marker">
                  <p>${item.name}</p>
                  <p>屏幕数：${item.screenNum} 个</p>
              </div>`
          item.title = item.name
          item.events = {
            click: () => {
              this.getIndexAdInfoList(item.id)
            }
          }
          return item
        })
      })
    },

    /**
             * @Description: 获取广告信息列表
             * @date 2019/9/18  14:43
             */
    getIndexAdInfoList (shopId) {
      getIndexAdInfoList({shopId}).then(res => {
        console.log(res.AdvList, 'shopId')
        this.adList = res.AdvList
        this.isHideAdNav = false
      })
    },

    /**
             * @Description: 初始化地图配置
             * @date 2019/8/8  15:47
             */
    initMapConfig () {
      // 初始化地图
      this.mapConfig.amapManager = new VueAMap.AMapManager()
      VueAMap.initAMapApiLoader({
        key: this.$config.AMAP_KEY,
        plugin: ['AMap.ToolBar', 'AMap.Geolocation'],
        service: ['AMap.PlaceSearch'],
        v: '1.4.4'
      })
    },
    /**
     * @Description: 展开左侧订单列表  (组件调用)
     * @author LC
     * @date 2019/10/22
    */
    openLeft () {
      this.isHideAdNav = false
    },
    // 打开购物车
    showChat () {
      let token = sessionStorage.getItem('token') || ''
      if (token === '') {
        this.$login_call(() => {
          this.$router.push({path: '/auth'})
        })
      } else {
        this.$refs.shopCart.showDialog()
      }
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-layout-header {
    padding: 0;
    height: 50px;
    line-height: initial;
  }

  /deep/ .ivu-input, /deep/ .ivu-select-selection {
    border: 1px solid #6B71F3 !important;
  }

  /deep/ .ivu-input-search {
    background-color: #6B71F3 !important;
    border-color: #6B71F3 !important;
  }

  /*筛选容器*/
  .filter-box {
    height: 50px;
    padding: 0 55px;
    position: relative;
    z-index: 10;
  }

  /*广告类型容器*/
  .ad-type-box {
    margin-left: auto;
    border-radius: 6px;
    border: 1px solid white;

    button {
      width: 64px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #6B71F3;
      background-color: white;
    }

    .active-bt {
      color: white;
      border-radius: 0px 6px 6px 0px;
      background-color: #6B71F3;
    }
  }

  /*筛选按钮*/
  .filter-bt {
    color: white;
    z-index: 1;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 14px;
    margin-right: 10px;
    text-align: center;
    height: calc(100% - 7px);

    /*选中的筛选*/

    &.active-filter {
      color: #6B71F3;
      border-radius: 6px 6px 0 0;
      background-color: white;
    }

    /*筛选内容选项*/

    .filter-content-box {
      min-width: 267px;
      text-align: left;
      position: absolute;
      padding: 10px 16px;
      z-index: -1;
      left: 0;
      top: 43px;
      display: flex;
      flex-wrap: wrap;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.16);
      border-radius: 0 0 6px 6px;

      /*筛选 Item*/

      .filter-content-item {
        color: #808080;
        font-size: 12px;
        margin-left: 17px;
        margin-bottom: 10px;
        cursor: pointer;
        /*选中 Item */

        &.active-item {
          color: #6B71F3;
        }
      }
    }
  }

  /*地图容器*/
  .amap-box {
    width: 100%;
    height: 100%;
  }
  .search-box {
    position: absolute;
    top: 25px;
    right: 100px;
  }
  /*广告 列表容器*/
  .ad-content-box {
    width: 350px;
    height: 100%;
    background-color: white;
    position: absolute;
    box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.16);
    left: 0;
    top: 0;
    z-index: 1;
    transition: all .5s;

    &.hide {
      left: -350px;
    }

    /*广告列表容器*/

    .ad-list-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .footer {
        background-color: white;
        box-shadow: 0px 0px 6px 2px rgba(0, 0, 0, 0.16);
        margin-top: auto;
      }
    }

    /*收拢/展品按钮*/

    .receive-bt {
      width: 44px;
      height: 100px;
      background-color: white;
      z-index: 1;
      position: absolute;
      right: -44px;
      top: calc(50% - 22px);
      line-height: 100px;
      text-align: center;
      box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.18);
      border-radius: 0px 6px 6px 0px;

      img {
        width: 7px;
        height: 13px;
      }
    }
  }

  /*购物车按钮*/
  .cart-bt {
    position: absolute;
    z-index: 1;
    right: 170px;
    bottom: 170px;

    button {
      width: 45px;
      height: 45px;
      border: none;
      background: rgba(107, 113, 243, 1);
      box-shadow: 0px 0px 8px 0px rgba(0, 36, 255, 1);
      border-radius: 50%;
    }
  }
</style>

<style lang="less">

  /*点位 点坐标*/
  .point-marker {
    width: 100px;
    padding: 2px 5px;
    font-size: 12px;
    background-color: #6B71F3;
    color: white;
    position: relative;

    p {
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }

    &:before {
      width: 0;
      height: 0;
      position: absolute;
      left: 0;
      bottom: -20px;
      content: '';
      right: 0;
      border-bottom: 10px transparent dashed;
      border-left: 10px transparent dashed;
      border-right: 10px transparent dashed;
      border-top: 10px #6B71F3 solid;
      margin: auto;
    }
  }

  /*层级 点坐标*/
  .level-marker {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    text-align: center;
    color: white;
    background-color: #6B71F3;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    font-size: 12px;

    p {
      width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .amap-toolbar{
    right: 46px !important;
  }
</style>
