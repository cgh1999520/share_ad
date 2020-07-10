import {getUserRoleList} from '../../api/module/user'

export default {
  namespaced: true,
  state: {
    userRoleList: [] // 用户角色列表
  },
  getters: {
    // 获取用户角色列表
    getUserRoleList: state => state.userRoleList
  },
  mutations: {
    /**
     * @Description: 设置用户角色列表
     * @date 2019/5/17  14:23
     */
    setUserRoleList (state, payload) {
      state.userRoleList = payload
    }
  },
  actions: {
    /**
     * @Description: 更新 用户角色列表
     * @date 2019/5/17  14:24
     */
    updateUserRoleList ({commit}) {
      return new Promise((resolve, reject) => {
        getUserRoleList().then(res => {
          commit('setUserRoleList', res)
          resolve(res)
        }, err => reject(err))
      })
    }
  }
}
