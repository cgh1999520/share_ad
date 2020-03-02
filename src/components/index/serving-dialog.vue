<template>
  <dialog-control
    title="投放"
    width="60%"
    @close="closeDialog"
    v-model="isShowDialog">

    <!--地图点位控件-->
    <map-point :point-list="pointList"
               ref="mapPoint"
               @change="pointChange"
    ></map-point>

    <Card>
      <Form :label-width="100"
            ref="formEl"
            :model="formData" :rules="formDataRules">
        <Row>
          <Col :span="12">
            <FormItem label="选择数量：" prop="cpmNumber">
              <Input v-enter-number v-model="formData.cpmNumber"></Input>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="投放策略：" prop="deliveryStrategy">
              <Select v-model="formData.deliveryStrategy">
                <Option v-for="dst in filterData.deliveryStrategy"
                        :value="dst.key" :key="dst.key">{{ dst.value }}
                </Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :span="12">
            <FormItem label="开始时间：" prop="startTime">
              <DatePicker type="date" class="w-100b"
                          v-model="formData.startTime"
                          :options="startTimeOptions"
                          placeholder="请选择开始时间"></DatePicker>
            </FormItem>
          </Col>
          <Col :span="12">
            <FormItem label="结束时间：" prop="endTime">
              <DatePicker type="date" class="w-100b"
                          v-model="formData.endTime"
                          :disabled="!formData.startTime"
                          :options="endTimeOptions"
                          placeholder="请选择结束时间"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <FormItem label="投放资源： " prop="url">
          <upload-file-control
            v-model="formData.url"
            :accept="getAssetsType">
            <div class="font-12" v-show="!formData.url">
              将文件拖到此处，或<span class="color-6B71F3">点击上传</span>
            </div>
            <resource-review
              style="height: 100px;"
              :type="getAssetsType"
              :src="formData.url" v-show="formData.url"></resource-review>
          </upload-file-control>
        </FormItem>
        <Row>
          <Col :span="12">
            <FormItem label="投放方式：">
              <label for="" class="zoom-class" @click="changeValue('isZoom')">
                区域投放
                <Radio v-model="isZoom"></Radio>
              </label>
              <!-- <Select v-model="class_methods">
                <Option :value="1">点位投放
                </Option>
                <Option :value="2">区域投放
                </Option>
              </Select> -->
            </FormItem>
          </Col>
        </Row>
        <FormItem label="省(多选)：" prop="provinces" class="ml114">
          <CheckboxGroup v-model="provinces">
            <Checkbox v-for="pro of getProvincesList" :label="pro.name" :key="pro.id">
              <span class="checkbox-item">{{pro.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="市(多选)：" prop="citys" class="ml114">
          <CheckboxGroup v-model="citys">
            <Checkbox v-for="pro of getCitysList"
                      :label="pro.name" :key="pro.id">
              <span class="checkbox-item">{{pro.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="区(多选)：" prop="areas" class="ml114">
          <CheckboxGroup v-model="areas">
            <Checkbox v-for="pro of getAreas"
                      :label="pro.name" :key="pro.id">
              <span class="checkbox-item">{{pro.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div>
        <label for="" class="zoom-class" style="margin-left:102px;" @click="changeValue">
          点位投放
          <Radio v-model="isPosition"></Radio>
        </label>
        <div class="color-4D4D4D mg-bottom-20" style="margin-left:102px;">
          <span> </span>
          <Button type="success"
                  class="float-right mg-bottom-20"
                  @click="$refs.mapPoint.showDialog()"
                  shape="circle" icon="ios-add"></Button>
        </div>
        <Table class="" style="margin-left:102px;" :data="pointList" :border="true" :columns="columns">
          <template slot-scope="{ row }" slot="operating">
            <Button type="error" size="small"
                    @click="removePointItem(row)"
                    class="bg-F05151" icon="ios-trash">删除
            </Button>
          </template>
        </Table>
        <Button class="bg-6B71F3 w-200 dis-block pay-bt"
                @click="onSubmit"
                type="primary">保存
        </Button>
      </div>
    </Card>
  </dialog-control>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import DialogMixin from '../../mixins/dialog-mixin'
import {mapActions, mapGetters} from 'vuex'
import UploadFileControl from '../upload-file-control'
import fecha from 'fecha'
import {copyObj} from '../../utils/utils'
import MapPoint from './map-point'
import {uuid} from 'vue-uuid'
import md5 from 'md5'
import ResourceReview from './resource-preview'
import PayAdDialog from './pay-ad-dialog'

export default {
  name: 'serving-dialog',
  mixins: [DialogMixin],
  components: {PayAdDialog, ResourceReview, MapPoint, UploadFileControl, DialogControl},
  data () {
    return {
      adDetail: {},
      pointList: [],
      startTimeOptions: { // 开始时间配置
        disabledDate: (date) => {
          return date && date.valueOf() < new Date()
        }
      },
      endTimeOptions: { // 结束时间配置
        disabledDate: (date) => {
          return date && this.formData.startTime && date.valueOf() < this.formData.startTime
        }
      },
      formDataRules: {
        startTime: [{required: true, message: '请选择开始日期', type: 'date', trigger: 'change'}],
        endTime: [{required: true, message: '请选择结束日期', type: 'date', trigger: 'change'}],
        deliveryStrategy: [{required: true, message: '请选择投放策略', type: 'number', trigger: 'change'}],
        // cpmNumber: [{required: true, message: '请选择投放数量', type: 'number', trigger: 'blur'}], lc
        cpmNumber: [{required: true, message: '请选择投放数量', trigger: 'blur'}],
        url: [{required: true, message: '请选择投放资源', trigger: 'change'}],
        provinces: [{required: true, message: '请选择投放地区', trigger: 'change'}]
      },
      formData: {
        cpmNumber: '1',
        searchKey: '',
        dayNumber: '',
        startTime: '',
        endTime: '',
        ids: '',
        citys: '',
        areas: '',
        provinces: '',
        orderCreateType: 0,
        advertisingSpaceId: '',
        deliveryStrategy: '',
        url: ''
      },
      filterData: {
        deliveryStrategy: [{key: 0, value: '平均投放'}, {key: 1, value: '不限制投放'}] // 投放类型
      },
      columns: [
        {title: '名称', key: 'name'},
        {title: '省份', key: 'provinceName'},
        {title: '城市', key: 'cityName'},
        {title: '区县', key: 'regionName'},
        {title: '地址', key: 'address'},
        {title: '屏数', key: 'screenNum'},
        {title: '操作', slot: 'operating', width: 100}
      ],
      isZoom: true, // 选择的投放方式
      isPosition: false // 选择的投放方式
    }
  },
  computed: {
    ...mapGetters(['getCityList', 'getIndexFilterData']),
    /**
   * @Description: 获取资源类型
   * @date 2019/9/27
   */
    getAssetsType () {
      switch (this.adDetail.materielType) {
        case '视频':
          return 'video/*'
        case '图片':
          return 'image/*'
      }
      return ''
    },
    /**
             * @Description: 获取省级
             * @date 2019/9/24
             */
    getProvincesList () {
      return this.getCityList
    },
    /**
             * @Description: 获取城市
             * @date 2019/9/24
             */
    getCitysList () {
      let citys = []
      this.getProvincesList.forEach(item => {
        if (this.provinces.indexOf(item.name) !== -1) citys.push(...item.list)
      })
      return citys
    },
    /**
             * @Description: 获取区域
             * @date 2019/9/24
             */
    getAreas () {
      let areas = []
      this.getCitysList.forEach(item => {
        if (this.citys.indexOf(item.name) !== -1) areas.push(...item.list)
      })
      return areas
    },
    /**
    * @Description: 省级，格式化
    * @date 2019/9/27
    */
    provinces: {
      set (val) {
        if (!val) return
        this.formData.provinces = val.join()
      },
      get () {
        const provinces = this.formData.provinces
        return provinces ? provinces.split(',') : []
      }
    },
    /**
     * @Description: 城市，格式化
     * @date 2019/9/27
     */
    citys: {
      set (val) {
        if (!val) return
        this.formData.citys = val.join()
      },
      get () {
        const citys = this.formData.citys
        return citys ? citys.split(',') : []
      }
      // get () { return this.formData.citys }
    },
    /**
             * @Description: 区域，格式化
             * @date 2019/9/27
             */
    areas: {
      set (val) {
        if (!val) return
        this.formData.areas = val.join()
      },
      get () {
        const areas = this.formData.areas
        return areas ? areas.split(',') : []
      }
    },
    /**
             * @Description: 开始日期
             * @date 2019/9/27
             */
    startTime: {
      set (val) {
        if (!val) return
        this.formData.startTime = fecha.format(val, 'YYYY-MM-DD')
      },
      get () {
        return this.formData.startTime ? new Date(this.formData.startTime) : ''
      }
    },
    /**
             * @Description: 结束日期
             * @date 2019/9/27
             */
    endTime: {
      set (val) {
        if (!val) return
        this.formData.endTime = fecha.format(val, 'YYYY-MM-DD')
      },
      get () {
        return this.formData.endTime ? new Date(this.formData.endTime) : ''
      }
    }
  },
  mounted () {
    // console.log('"this.formData"', this.formData)
  },
  methods: {
    ...mapActions(['removeAdShoppingCart', 'addAdShoppingCart']),
    /**
             * @Description: 点位选择改变
             * @date 2019/9/25
             */
    pointChange (event) {
      this.pointList.push(event)
    },

    /**
             * @Description: 移除点位
             * @date 2019/9/25
             */
    removePointItem (event) {
      const inx = this.pointList.findIndex(item => item.id === event.id)
      this.pointList.splice(inx, 1)
    },

    /**
             * @Description: 投放广告
             * @date 2019/9/23
             */
    servingAd (ad) {
      this.adDetail = ad
      this.initFormData()
      this.isShowDialog = true
    },
    /**
             * @Description: 初始化表单信息
             * @date 2019/9/27
             */
    initFormData () {
      this.pointList = this.adDetail.pointList || []
      this.$refs.formEl.resetFields()
      if (!this.adDetail.order) return
      this.formData = copyObj(this.adDetail.order, this.formData)
    },
    /**
             * @Description: 提交
             * @date 2019/9/24
             */
    onSubmit () {
      this.$refs.formEl.validate(valid => {
        if (!valid) return
        let formData = copyObj(this.formData)
        formData.searchKey = uuid.v4() + '-' + md5(this.adDetail.id)
        formData.advertisingSpaceId = this.adDetail.id
        formData.ids = this.pointList.map(po => po.id).join()

        // 投放成功后，移除原广告购物车
        this.removeAdShoppingCart(this.adDetail)
        let adDetail = this.adDetail
        adDetail.order = formData
        adDetail.pointList = this.pointList
        this.addAdShoppingCart(adDetail)
        this.closeDialog()
      })
    },
    changeValue (is) {
      console.log(is, 'is')
      if (is === 'isZoom') {
        this.isZoom = !this.isZoom
      } else {
        this.isPosition = !this.isPosition
      }
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-checkbox {
    display: none;
  }

  /*多选框 Item*/
  .checkbox-item {
    text-align: center;
    padding: 6px 8px;
    height: 30px;
    line-height: 30px;
    border-radius: 6px;
    color: #4D4D4D;
  }

  /deep/ .ivu-checkbox-wrapper-checked .checkbox-item {
    color: white;
    background: rgba(107, 113, 243, 1);
  }

  /*支付按钮*/
  .pay-bt {
    margin: 30px auto 0;
    border-radius: 30px
  }
  .zoom-class{
    font-size: 18px;
    color: #333;
  }
  .ml114{
    margin-left: 78px;
  }
</style>
