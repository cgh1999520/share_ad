<template>
  <Layout class="h-100b">
    <Content style="padding: 50px 130px;"
             class="bg-white dis-flex align-item-center flex-column justify-content-center">
        <div style="color: #656565;font-size: 15px;" class="w100p">
          <span style="width: 9px;height: 9px;" class="radius-50 dis-inline-block mg-right-10 bg-6B71F3"></span>
          展现量
          <!--日期选择器-->
          <div class="float-right date-select">
            <DatePicker value="startTime" class="date-item" placeholder="开始时间"></DatePicker>
            <span style="width: 14px;height: 2px;" class="dis-inline-block"></span>
            <DatePicker value="endTime" class="date-item" placeholder="结束时间"></DatePicker>
          </div>
        </div>
        <display-volume :columns_u="['time', 'playNumber']" :data_u="resData"></display-volume>
        <div style="font-size: 30px;" class="color-4D4D4D">
          展现量
        </div>
      </Content>
    </Layout>
</template>

<script>
import DisplayVolume from '@/components/display-volume'
import {dataStatistics} from '../../api/module'
export default {
  name: 'data-statistics',
  components: {DisplayVolume},
  data () {
    return {
      startTime: '',
      endTime: '',
      resData: []
    }
  },
  mounted () {
    this.searchData()
  },
  methods: {
    // 搜索数据
    searchData () {
      dataStatistics({
        startTime: this.startTime === '' ? null : this.startTime,
        endTime: this.endTime === '' ? null : this.endTime
      }).then(res => {
        if (res.length === 0) {
          this.$Modal.error({
            title: '温馨提示:',
            content: '暂时没有数据!'
          })
        }
        this.resData = res
      })
    }
  }
}
</script>

<style scoped>
  .w100p{
    width: 100%
  }
</style>
