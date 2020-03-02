<template>
  <div class="dis-flex custom-img-box default-img"
       :style="{backgroundImage: 'url(' + value + ')'}">
    <!--操作容器-->
    <div class="preview-box" v-if="showOperating">
      <Icon type="ios-eye-outline" @click.native="previewImg()"></Icon>
      <slot name="operating"></slot>
    </div>

    <!-- 图片预览-->
    <Modal title="预览图片" v-model="visible">
      <img :src="value" oncontextmenu="return false;" ondragstart="return false;" style="width: 100%;">
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
export default {
  name: 'custom-img',
  props: {
    showOperating: { // 是否显示操作
      type: Boolean,
      default: true
    },
    value: { // 图片地址
      required: true
    }
  },
  data () {
    return {
      visible: false // 是否显示预览窗
    }
  },
  methods: {
    /**
       * @Description: 预览图片
       * @date 2019/5/29  10:33
       */
    previewImg () {
      this.visible = true
    }
  }
}
</script>

<style scoped lang="less">

  /*列表 封面 图片*/
  .default-img {
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    overflow: hidden;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  /*自定义图片容器*/
  .custom-img-box {
    position: relative;

    &:hover .preview-box {
      opacity: 1;
    }
  }

  .preview-box {
    opacity: 0;
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, .6);
    transition: all .5s;

    i {
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      margin: 0 2px;
    }
  }

</style>
