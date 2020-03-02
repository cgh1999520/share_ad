<template>
  <dialog-control
    title="充值"
    v-model="isShowDialog"
    @close="closeDialog">
    <Card style="padding: 23px 29px;width: 100%;">
      <Form :label-width="75">
        <FormItem label="充值金额：">
          <Input placeholder="请输入金额" type="number" v-model="isPrice"></Input>
        </FormItem>
        <FormItem label="支付方式：">
          <RadioGroup vertical class="pay-type" v-model="radioChange" @on-change="changeClass">
            <Radio label="wechat">
              <img class="pay-type-img" src="../../assets/images/account/wechat.png">微信
              <div id="qrCodeW" ref="qrCodeDivW"></div>
<!--              <div>-->
<!--                <img class="pay-img" src="../../assets/images/account/pay-code.png">-->
<!--              </div>-->
            </Radio>
            <Radio label="alipay">
              <img class="pay-type-img" src="../../assets/images/account/alipay.png">支付宝
              <div id="qrCodeZ" ref="qrCodeDivZ"></div>
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
import {payRecharge, orderStatus} from '../../api/module'
import {mapActions} from 'vuex'
export default {
  name: 'recharge-balance-dialog',
  components: {DialogControl},
  mixins: [DialogMixin],
  data () {
    return {
      radioChange: '', // 单选状态
      isPrice: 10, // 充值金额
      billId: '', // 订单id
      timeOut: 0 // 轮询的过期时间
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions(['updataBalanceMoney']),
    // 选择支付方式
    payChange (me) {
      console.log('方式是', me, this.radioChange)
    },
    // showData展示数据
    changeClass () {
      // let node = document.getElementById('qrCodeW')
      // let node1 = document.getElementById('qrCodeZ')
      // node.innerHTML = ''
      // node1.innerHTML = ''
      // let _this = this
      let timer = null
      if (this.radioChange === 'wechat' || this.radioChange === 'alipay') {
        payRecharge({
          money: this.isPrice
        }).then(res => {
          this.billId = res.billId
          this.closeCode()
          this.bindQRCode(res.codeUrl)
          timer = setInterval(() => {
            orderStatus({
              billId: this.billId,
              type: 'Balance'
            }).then(res => {
              this.timeOut++
              // console.log('支付中', this.timeOut)
              if (res.paystate === '1') {
                clearInterval(timer)
                this.timeOut = 0 // 重置过期时间
                this.radioChange = '' // 重置选项
                this.updataBalanceMoney()
                this.$Modal.success({
                  title: '温馨提示',
                  content: '充值成功！',
                  closable: true,
                  onOK: function () {
                    this.closeDialog() // 关闭支付弹窗
                  }
                })
              } else if (this.timeOut === 180) {
                clearInterval(timer)
                this.timeOut = 0 // 重置过期时间
              }
            })
          }, 1000)
        })
      } else {
        return false
      }
      console.log('方式是', this.radioChange, this.isPrice)
    },
    // 二维码生成
    bindQRCode (url) {
      /* eslint-disable no-new */
      if (this.radioChange === 'wechat') {
        new QRCode(this.$refs.qrCodeDivW, {
          text: url,
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        })
      } else if (this.radioChange === 'alipay') {
        new QRCode(this.$refs.qrCodeDivZ, {
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
      this.$refs.qrCodeDivW.innerHTML = ''
      this.$refs.qrCodeDivZ.innerHTML = ''
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
