/**
 * @Description: 财务管理相关 数据
 * @date 2019/5/9  13:52
 */

export default {
  namespaced: true,
  state: {
    payType: [
      {name: '支付宝', key: 'alipay'},
      {name: '微信', key: 'wxpay'},
      {name: 'QQ钱包', key: 'qqpay'},
      {name: '京东钱包', key: 'jdpay'},
      {name: '银联钱包', key: 'unionPay'},
      {name: '微信公众号直充', key: 'wxgzhpay'}
    ], // 获取支付方式
    goldDetailType: [
      {name: '用户充值', key: '1'},
      {name: '用户提现', key: '2'},
      {name: '赠送金币', key: '3'},
      {name: '消费平台抽成', key: '4'},
      {name: '平台修改增加', key: '5'},
      {name: '平台修改减少', key: '6'}
    ]
  },
  getters: {
    // 获取财务支付方式
    getPayType: state => state.payType,
    // 获取金币流水详情
    getGldDetailType: state => state.goldDetailType
  },
  mutations: {
  },
  actions: {
  }
}
