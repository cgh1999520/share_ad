<template>
    <div style="padding: 2px;">
      <img :src="src" v-if="getType === 'img'" />
      <video controls :src="src" v-else-if="getType === 'video'"></video>
    </div>
</template>

<script>
export default {
  name: 'resource-review',
  props: {
    src: {type: String},
    type: {}
  },
  computed: {
    /**
      * @Description: 获取当前类型
      * @date 2019/9/25
      */
    getType () {
      return this.type.indexOf('image') !== -1 ? 'img' : 'video'
    }
  }
}
</script>
<style scoped lang="less">
  img,video {
    height: 100%;
  }
</style>
