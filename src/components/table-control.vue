<template>
  <div>
    <Table class="w-100b" :data="data" :border="true"
           @on-selection-change="$emit('selectChange', $event)"
           :columns="columns">
      <slot slot-scope="{ row }" slot="operating" class="tx-center" :row="row"></slot>
    </Table>

    <div class="tx-center mg-top-10" v-if="page">
      <Page :total="100" prev-text="上一页" next-text="下一页" class="mg-auto"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'table-control',
  props: {
    data: Array, // 数据
    columns: Array, // 列数据（title:key）
    stripe: { // 是否显示斑马纹
      type: Boolean,
      default: false
    },
    page: { // 显示页码
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped lang="less">

</style>
