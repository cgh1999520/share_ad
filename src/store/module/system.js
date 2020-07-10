/**
 * @Description: 系统相关
 * @date 2019/5/17  20:13
*/
export default {
  namespaced: true,
  state: {
    explainTypeList: [
      {key: 0, name: 'vip中心'},
      {key: 1, name: '关于'},
      {key: 2, name: '邀请好友介绍'},
      {key: 3, name: '自拍声明'},
      {key: 4, name: '注册服务协议'},
      {key: 5, name: '观影次数说明'}
    ] // 说明类型列表
  },
  getters: {
    // 获取说明类型列表
    getExplainTypeList: state => state.explainTypeList
  }
}
