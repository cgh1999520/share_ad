export default {
  namespaced: true,
  state: {
    reviewStatusList: [
      {key: 0, name: '新建'},
      {key: 1, name: '审核通过'},
      {key: 2, name: '审核拒绝'}
    ], // 审核状态列表
    reportTypeList: [
      {key: 1, name: '不真实'},
      {key: 2, name: '资金诈骗'},
      {key: 3, name: '广告'},
      {key: 4, name: '其他'}
    ] // 举报类型列表
  },
  getters: {
    // 获取 审核状态列表
    getReviewStatusList: state => state.reviewStatusList,
    // 获取 举报类型列表
    getReportTypeList: state => state.reportTypeList
  }
}
