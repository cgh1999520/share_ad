/**
 * @Description: 登录用户相关 数据
 * @date 2019/5/9  13:52
 */

import {getRootRouter, getUserRoleRouter, getUserRoleRouterBt} from '../../libs/util'
import {loginSystem} from '../../api/module/auth'
import router from '../../router/index'

export default {
  namespaced: true,
  state: {
    availableRouteBt: {}, // 界面可用的按钮 对象列表
    availableRoutes: [] // 获取可访问 路由列表
  },
  getters: {
    // 获取系统导航菜单列表
    getAvailableRoutes: state => state.availableRoutes,
    // 获取系统可操作按钮列表
    getAvailableRouteBt: state => state.availableRouteBt
  },
  mutations: {
    /**
     * @Description: 设置系统导航菜单列表
     * @date 2019/5/9  13:57
     */
    setAvailableRoutes (state, payload) {
      state.availableRoutes = payload
    },
    // 设置界面可用的按钮
    setAvailableRouteBt (state, payload) {
      state.availableRouteBt = payload
    }
  },
  actions: {
    /**
     * @Description: 登录系统
     * @date 2019/6/4  20:20
    */
    loginSystem ({state, commit}, payload) {
      return new Promise(async (resolve, reject) => {
        try {
          // 获取登录信息
          let loginInfo = await loginSystem(payload)
          // 设置token 与 访问路由， 这里设置sessionStorage 是为了方便取token 值
          sessionStorage.token = loginInfo.token

          // 获取用户角色可访问路由地址
          let routers = getUserRoleRouter(loginInfo.resources)
          router.addRoutes(routers)
          commit('setAvailableRoutes', routers)
          // 获取用户角色可操作的按钮
          commit('setAvailableRouteBt', getUserRoleRouterBt(loginInfo.resources))
          // 获取可访问根路由
          resolve(getRootRouter(routers))
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}
