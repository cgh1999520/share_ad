<template>
  <dialog-control
    title="选择点位"
    width="90%"
    @close="closeDialog"
    v-model="isShowDialog"
  >
    <Layout>
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
      </Header>
      <Content>
        <!--地图控件-->
        <el-amap vid="amap" ref="aMap" :amap-manager="mapConfig.amapManager"
                 :center="mapConfig.center" :zoom="mapConfig.zoom"
                 :plugin="mapConfig.plugin" :events="mapConfig.events" class="amap-box">
          <!--坐标点-->
          <el-amap-marker v-for="(marker, inx) in mapConfig.markers"
                          :key="inx"
                          :title="marker.title"
                          :content="marker.content"
                          :content-render="marker.contentRender"
                          :events="marker.events"
                          :position="marker.position"></el-amap-marker>
        </el-amap>
      </Content>
    </Layout>
  </dialog-control>
</template>

<script>
import * as VueAMap from 'vue-amap'
import {mapActions, mapGetters} from 'vuex'
import lodash from 'lodash'
import {getIndexPointData} from '@/api/module'
import {getIndexLevelData} from '../../api/module'
import DialogMixin from '../../mixins/dialog-mixin'
import DialogControl from '../dialog-control'

export default {
  name: 'map-point',
  components: {DialogControl},
  mixins: [DialogMixin],
  props: {
    pointList: { // 默认选择的点位列表
      type: Array,
      default: () => []
    }
  },
  data () {
    let self = this
    return {
      mapConfig: {
        amapManager: undefined,
        zoom: 12,
        position: [],
        center: [121.59996, 31.197646],
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
                  if (result && result.center) {
                    self.mapConfig.center = result.center
                    self.mapConfig.loaded = true
                    self.$nextTick()
                  }
                })
              }
            }
          }
        ],
        events: {
          zoomend: this.getAdList, // 地图缩放结束
          moveend: this.getAdList // 地图移动结束
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
      },
      currentFilter: ''
    }
  },
  created () {
    this.initMapConfig()
    this.updateCityList()
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
    ...mapActions(['updateCityList', 'updateIndexFilterData', 'addAdShoppingCart']),
    /**
             * @Description: 是否已选择该点位
             * @date 2019/9/25
             */
    isSelectPoint (point) {
      return this.pointList.findIndex(item => item.id === point.id) !== -1
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
      event.title = val
      this.formData[event.filterKey] = val
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
    getAdList: lodash.debounce(function () {
      // 判断当前的缩放层级
      // const map = this.mapConfig.amapManager.getMap()
      const zoom = 18 // map.getZoom()
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
        this.mapConfig.markers = res.shopList.map(item => {
          item.position = [item.wgLon, item.wgLat]
          item.contentRender = h => {
            return h('div', {class: 'point-marker'}, [
              h('p', item.name),
              h('p', `屏幕数：${item.screenNum} 个`),
              h('Button', {
                class: 'w-100b',
                props: {
                  size: 'small',
                  type: 'success',
                  disabled: this.isSelectPoint(item)
                },
                on: {
                  click: () => {
                    this.$emit('change', item)
                  }
                }
              }, this.isSelectPoint(item) ? '已选择' : '选择')
            ])
          }
          item.title = item.name
          return item
        })
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
        v: '1.4.4'
      })
    }
  }
}
</script>

<style scoped lang="less">
  /*
  FIXME： 地图无法自适应高度，这里通过css 计算写死，待优化
   */
  .ivu-modal-fullscreen-no-footer .ivu-modal-body {
    .amap-box {
      height: calc(100vh - 140px);
    }
  }

  /deep/ .ivu-layout-header {
    padding: 0;
    height: 50px;
    line-height: initial;
  }

  /*筛选容器*/
  .filter-box {
    height: 50px;
    padding: 0 55px;
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
    height: 50vh;
  }
</style>
