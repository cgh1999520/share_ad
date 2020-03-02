<template>
  <Modal
    :value="value"
    :closable="false"
    :width="width"
    :footer-hide="true"
    :fullscreen="isFullscreen"
    :mask-closable="false">

    <div class="dis-flex" style="color: #333333;font-weight:400;font-size: 20px;" slot="header">
      {{title}}

      <div class="mg-left-auto dialog-operating">
        <button class="button" @click="isFullscreen = !isFullscreen">
          <img :src="isFullscreen ? require('../assets/images/dialog-small.png'): require('../assets/images/dialog-plus.png')">
        </button>
        <button class="button" @click="closeDialog">
          <img src="../assets/images/dialog-close.png">
        </button>
      </div>
    </div>
        <slot></slot>
  </Modal>
</template>

<script>
export default {
  name: 'dialog-control',
  data () {
    return {
      isFullscreen: false
    }
  },
  props: {
    title: String,
    value: Boolean,
    width: [String, Number]
  },
  watch: {
    value (val) {
      if (val) {
        this.isFullscreen = false
      }
    }
  },
  methods: {
    /**
       * @Description: 关闭弹窗
       * @date 2019/8/9  10:13
       */
    closeDialog () {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-modal-content {
    border-radius: 0;
  }

  /deep/ .ivu-modal-header, /deep/ .ivu-modal-footer {
    border: none;
  }

  /*弹窗 操作 容器*/
  .dialog-operating {
    display: flex;
    align-items: center;

    button {
      &:nth-child(2) {
        margin-left: 18px;
        margin-right: 18px;
      }
    }

    img {
      width: 16px;
      display: block;
      margin: auto;
    }
  }
</style>
