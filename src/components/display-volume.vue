<template>
  <ve-line
    class="w-100b"
    :data="chartConfig.chartData"
    :tooltip-visible="false"
    :legend-visible="false"
    :settings="chartConfig.chartSettings"></ve-line>
</template>

<script>
import ChartLine from 'v-charts/lib/line.common.min'
import echarts from 'echarts'

export default {
  name: 'display-volume',
  components: {'ve-line': ChartLine},
  props: {
    columns_u: Array, // 图标的横纵轴
    data_u: Array // 图标数据
  },
  data: function () {
    return {
      chartConfig: {
        chartData: {
          columns: this.columns_u || ['日期', '展现量'],
          rows: this.data_u || [
            {'日期': '2018-01-01', '展现量': 110},
            {'日期': '2018-01-02', '展现量': 205},
            {'日期': '2018-01-11', '展现量': 301},
            {'日期': '2018-01-16', '展现量': 2004},
            {'日期': '2018-01-25', '展现量': 506},
            {'日期': '2018-01-29', '展现量': 789}
          ]
        },
        chartSettings: {
          area: true,
          xAxisType: 'time',
          itemStyle: {
            normal: {
              lineStyle: { // 系列级个性化折线样式
                width: 3,
                color: '#6B71F3' // 折线的颜色
              },
              // 更改颜色为渐变
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: '#E9E8E8'
                },
                {
                  offset: 1,
                  color: 'rgba(107,113,243,0.26)'
                }])
            }
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
