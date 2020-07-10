/**
 * @Description: 会员相关
 * @date 2019/5/15  10:57
 */
import {getMemberAuthorityList, getMemberGradeList, getMemberRoleList} from '../../api/module/member'

export default {
  namespaced: true,
  state: {
    memberAuthorityList: [], // 会员管理 权限列表
    memberGradeList: [], // 会员管理 等级列表
    memberRoleList: [], // 会员管理 角色列表
    memberAwardTypeList: [
      {key: 0, name: '经验值'},
      {key: 1, name: '金币'},
      {key: 2, name: '经验值与金币'}
    ], // 会员奖励类型列表
    memberClassifyTypeList: [
      {key: 0, name: '推广'},
      {key: 1, name: '新手'},
      {key: 2, name: 'VIP'}
    ], // 会员任务分类类型列表
    memberTaskTypeList: [
      {key: 0, name: '邀请新用户'},
      {key: 1, name: '分享内容'},
      {key: 2, name: '完善资料'},
      {key: 3, name: '点评、评论'},
      {key: 4, name: '注册'},
      {key: 5, name: '浏览内容'},
      {key: 6, name: '实名认证'},
      {key: 7, name: '每日首发图文'},
      {key: 8, name: '每日首发视频'},
      {key: 9, name: '每日首次消费'},
      {key: 10, name: '连续登陆满x天'}
    ], // 会员任务类型列表
    memberWalletTypeList: [
      {name: '充值', key: 0},
      {name: '提现', key: 1},
      {name: '推荐提成', key: 2},
      {name: '内容消费发布者提成', key: 3},
      {name: '提现失败', key: 4},
      {name: '观看短视频消费', key: 5},
      {name: '阅读小说消费', key: 6},
      {name: '加好友消费', key: 7},
      {name: '内容消费上级提成', key: 8},
      {name: '邀请新用户获得', key: 9},
      {name: '完成其他任务获得', key: 10},
      {name: '系统修改增加', key: 11},
      {name: '分享内容获得', key: 12},
      {name: '完善资料获得', key: 13},
      {name: '点评、评论获得', key: 14},
      {name: '浏览内容获得', key: 15},
      {name: '实名认证获得', key: 16},
      {name: '每日首发图文获得', key: 17},
      {name: '每日首发视频获得', key: 18},
      {name: '每日首次消费获得', key: 19},
      {name: '连续登陆获得', key: 20},
      {name: '系统修改减少', key: 21},
      {name: '查看微信消费', key: 22},
      {name: '查看手机号支付消费', key: 23},
      {name: 'IM聊天消费', key: 24}
    ], // 会员金币类型列表
    memberRoleTypeList: [
      {name: '游客', key: 0},
      {name: '非会员', key: 1},
      {name: '会员', key: 2}
    ], // 会员角色类型
    customerServiceTypeList: [
      {name: '代理充值客服', key: 1},
      {name: '小秘书', key: 2},
      {name: '推广客服', key: 3}
    ], // 会员客服类型列表
    memberRoleAuthorityList: [] // 会员角色权限列表
  },
  getters: {
    // 获取会员客服类型列表
    getCustomerServiceTypeList: state => state.customerServiceTypeList,
    // 获取会员奖励类型列表
    getMemberAwardTypeList: state => state.memberAwardTypeList,
    // 获取会员任务分类列表
    getMemberClassifyTypeList: state => state.memberClassifyTypeList,
    // 获取会员任务类型列表
    getMemberTaskTypeList: state => state.memberTaskTypeList,
    // 获取会员管理权限列表
    getMemberAuthorityList: state => state.memberAuthorityList,
    // 获取会员管理等级列表
    getMemberGradeList: state => state.memberGradeList,
    // 获取会员管理等级列表
    getMemberRoleList: state => state.memberRoleList,
    // 获取会员角色类型
    getMemberRoleTypeList: state => state.memberRoleTypeList,
    // 获取会员金币类型列表
    getMemberWalletTypeList: state => state.memberWalletTypeList
  },
  mutations: {
    // 设置会员管理权限列表
    setMemberAuthorityList (state, payload) {
      state.memberAuthorityList = payload
    },
    // 设置会员管理等级列表
    setMemberGradeList (state, payload) {
      state.memberGradeList = payload
    },
    // 设置会员管理角色列表
    setMemberRoleList (state, payload) {
      state.memberRoleList = payload
    }
  },
  actions: {
    /**
     * @Description: 更新会员权限数据列表
     * @date 2019/5/15  11:02
     */
    updateMemberAuthorityList ({commit}) {
      getMemberAuthorityList().then(res => commit('setMemberAuthorityList', res))
    },
    /**
     * @Description: 更新 会员等级数据列表
     * @date 2019/5/15  11:03
     */
    updateMemberGradeList ({commit}) {
      getMemberGradeList().then(res => commit('setMemberGradeList', res))
    },

    /**
     * @Description: 更新 会员角色数据列表
     * @date 2019/5/15  11:03
     */
    updateMemberRoleList ({commit}) {
      getMemberRoleList().then(res => commit('setMemberRoleList', res))
    }
  }
}
