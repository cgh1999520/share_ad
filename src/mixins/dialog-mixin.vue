
<script>
export default {
  name: 'dialog-mixin',
  props: {
    finish: { // 回调函数
      type: Function
    }
  },
  data () {
    return {
      isShowDialog: false
    }
  },
  methods: {
    /**
     * @Description: 关闭弹窗
     * @date 2019/8/9  10:27
     */
    closeDialog () {
      this.isShowDialog = false
    },
    /**
     * @Description: 显示弹窗
     * @date 2019/8/9  11:29
     */
    showDialog () {
      this.isShowDialog = true
    }
  }
}
</script>
