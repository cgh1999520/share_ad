<template>
  <dialog-control
    title="支付"
    v-model="isShowDialog"
    @close="closeDialog"
  >
    <Card style="padding: 23px 29px;width: 100%;">
      <Form :label-width="75">
        <FormItem label="支付金额：">
          <div style="color: #F05151;font-size: 24px;" class="">￥{{isTotal}}</div>
        </FormItem>
        <FormItem label="支付方式：">
          <RadioGroup vertical class="pay-type" v-model="radioChange" @on-change="changeClass">
            <Radio label="wechat">
              <img class="pay-type-img" src="../../assets/images/account/wechat.png">微信
              <div v-if="radioChange=='wechat'" id="qrCodeW" ref="qrCodeDivW1"></div>
            </Radio>
            <Radio label="alipay">
              <img class="pay-type-img" src="../../assets/images/account/alipay.png">支付宝
              <div v-if="radioChange=='alipay'" id="qrCodeZ" ref="qrCodeDivZ1"></div>
            </Radio>
            <Radio label="balance">
              <img class="pay-type-img" src="../../assets/images/account/line-pay.png">余额支付
            </Radio>
<!--            <Radio label="line">-->
<!--              <img class="pay-type-img" src="../../assets/images/account/line-pay.png">线下支付-->
<!--            </Radio>-->
          </RadioGroup>
        </FormItem>
      </Form>
    </Card>
  </dialog-control>
</template>

<script>
import DialogControl from '@/components/dialog-control'
import DialogMixin from '@/mixins/dialog-mixin'
import QRCode from 'qrcodejs2'
import {orderStatus, payOrder, payOrderBalance} from '../../api/module'
import {mapActions} from 'vuex'
export default {
  name: 'pay-ad-dialog',
  components: {DialogControl},
  mixins: [DialogMixin],
  props: {
    orderData: {
      type: Array
    }
  },
  data: function () {
    return {
      radioChange: '',
      timeOut: 0
    }
  },
  computed: {
    // 总价的计算属性
    isTotal () {
      let total = 0
      this.orderData.map(item => {
        total += item.money
      })
      return total
    }
  },
  methods: {
    ...mapActions(['updataBalanceMoney']),
    // showData展示数据
    changeClass () {
      // 清空二维码结束
      let _this = this
      let timer = null
      let orderId = []
      // 将传过来的数据装入数组
      this.orderData.map(item => {
        orderId.push(item.orderId)
      })
      if (this.radioChange === 'wechat' || this.radioChange === 'alipay') { // 微信支付
        // 支付接口获取
        payOrder({
          BillIds: orderId.join(',')
        }).then(res => {
          // 获取到支付id
          this.billId = res.billId
          // this.$nextTick(function () {
          // 生成微信支付二维码
          this.bindQRCode(res.codeUrl)
          timer = setInterval(() => {
            // 检测状态支付状态
            orderStatus({
              billId: this.billId,
              type: 'advertising'
            }).then(res => {
              this.timeOut++
              // console.log('resres', res)
              if (res.paystate === '1') { // 为1时 支付成功
                clearInterval(timer)
                this.timeOut = 0 // 重置过期时间
                _this.$emit('searchData')
                _this.radioChange = ''
                this.$Modal.success({ // 提示支付成功
                  title: '温馨提示',
                  content: '支付成功！',
                  closable: true,
                  onOK: function () {
                    _this.closeDialog() // 关闭支付弹窗
                    _this.$emit('searchData')
                  }
                })
              } else if (this.timeOut === 180) {
                clearInterval(timer)
                this.timeOut = 0 // 重置过期时间
              }
            })
          }, 1000)
          // })
        })
      } else if (this.radioChange === 'balance') { // 余额支付
        clearInterval(timer)
        payOrderBalance({
          billIds: orderId.join(',')
        }).then(res => {
          _this.$emit('searchData')
          _this.radioChange = ''
          this.updataBalanceMoney()
          this.$Modal.success({ // 提示支付成功
            title: '温馨提示',
            content: '支付成功！',
            closable: true,
            onOK: function () {
              _this.closeDialog() // 关闭支付弹窗
              debugger
              _this.$emit('searchData')
            }
          })
          this.closeDialog() // 关闭支付弹窗
        })
      } else {
        return false
      }
    },
    // 二维码生成
    bindQRCode (url) {
      /* eslint-disable no-new */
      if (this.radioChange === 'wechat') {
        new QRCode(this.$refs.qrCodeDivW1, {
          text: url,
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })
      } else if (this.radioChange === 'alipay') {
        new QRCode(this.$refs.qrCodeDivZ1, {
          text: url,
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })
      }
    },
    // 关闭弹框,清除已经生成的二维码
    closeCode () {
      this.$refs.qrCodeDivW1.innerHTML = ''
      this.$refs.qrCodeDivZ1.innerHTML = ''
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .ivu-radio-checked .ivu-radio-inner {
    border-color: #6B71F3;
  }

  /deep/ .ivu-radio-group-vertical .ivu-radio-wrapper {
    height: auto;
  }

  /deep/ .ivu-radio-inner:after {
    background-color: #6B71F3;
  }

  .pay-type {
    /* 支付类型图片 */

    .pay-type-img {
      width: 21px;
      margin-left: 10px;
      vertical-align: middle;
    }

    /*支付图片*/

    .pay-img {
      width: 212px;
      height: 212px;
      box-shadow:0px 0px 10px 2px rgba(0, 0, 0, 0.1);
    }
  }
</style>
