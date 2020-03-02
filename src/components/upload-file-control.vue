<template>
  <Upload
    type="drag"
    :data="uploadData"
    :show-upload-list="false"
    :multiple="multiple"
    :accept="accept"
    :on-success="updateSuccess"
    :action=" $config.BASE_URL + '/dspManager/file/uploadMoreImage'">
      <slot>
        <div style="padding: 20px 0; height: 100%" class="dis-flex justify-content-center flex-column">
          <Icon type="ios-cloud-upload" size="30" class="color-6B71F3"></Icon>
          <div class="font-12">
            将文件拖到此处，或<span class="color-6B71F3">点击上传</span>
          </div>
        </div>
      </slot>
  </Upload>
</template>

<script>

export default {
  name: 'upload-file-control',
  props: {
    value: {
    },
    multiple: { // 多文件
      default: false
    },
    accept: { // 上传文件类型
      default: 'image/*'
    }
  },
  data () {
    return {
      uploadData: { // 上传信息
        token: ''
      }
    }
  },
  computed: {
    /**
     * @Description: 获取文件列表
     * @date 2019/8/12  13:52
     */
    getFiles () {
      if (this.value && this.value instanceof File) {
        return [this.value]
      }
      return this.value ? this.value.split(',') : []
    }
  },
  created () {
    // 初始化上传参数
    this.uploadData.token = sessionStorage.token
  },
  methods: {
    /**
     * @Description: 上传成功
     * @date 2019/5/29  9:40
     */
    async updateSuccess (event) {
      if (event.code !== 0) {
        this.$Message.error(event.message || '上传失败，请重试')
      }

      // 如果当前不是多文件上传，则重置数据,
      // 这里有个坑,如果是多选图片，就需要用变量存放图片数据，不然并行上传就会出现 图片相同BUG
      let files = this.getFiles
      if (this.multiple) {
        files.push(event.data)
      }
      // 上传成功事件
      this.$emit('success', ...[event, this.file])
      this.$emit('input', this.multiple
        ? files.join() : event.data)
    }
  }
}
</script>

<style scoped lang="less">

  /deep/ .ivu-upload-drag {
    border: 1px solid #6B71F3;
    height: 100%;

    &:hover {
      border-color: #6B71F3;
    }
  }
</style>
