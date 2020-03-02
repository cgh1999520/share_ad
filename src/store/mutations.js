export default {
  // 设置首页筛选数据
  setIndexFilterData: (state, payload) => { state.indexFilterData = payload },
  // 设置城市列表
  setCityList: (state, payload) => { state.cityList = payload },
  // 设置购物车列表
  setAdShoppingCartList: (state, payload) => { state.adShoppingCartList = payload },
  // 设置用户信息
  setUserInfo: (state, payload) => { state.userInfo = payload },
  // 设置消息列表
  setMessageList: (state, payload) => { state.messageList = payload },
  // 设置余额
  setBalanceMoney: (state, payload) => { state.balanceMoney = payload }
}
