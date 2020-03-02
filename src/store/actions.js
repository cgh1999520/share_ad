import {userLogin} from '@/api/module/auth'
import {getCityList, getIndexFilterData} from '../api/module'
import {getMessageList, getUserDetail} from '../api/module/account'

export default {
  /**
   * @Description: 用户登录系统
   * @date 2019/9/11  10:57
   */
  async userLogin ({commit}, payload) {
    try {
      let userInfo = await userLogin(payload)
      sessionStorage.token = userInfo.token
      commit('setUserInfo', userInfo)
      return userInfo
    } catch (e) {
      return Promise.reject(e)
    }
  },
  /**
   * @Description: 更新用户信息
   * @date 2019/9/11  10:57
   */
  async updateUserInfo ({commit}, payload) {
  },
  /**
   * @Description: 更新城市列表
   * @date 2019/9/11  10:57
   */
  async updateCityList ({commit, state}) {
    if (state.cityList.length > 0) return
    getCityList().then(res => commit('setCityList', res))
  },
  /**
   * @Description: 更新首页筛选数据
   * @date 2019/9/11  10:57
   */
  async updateIndexFilterData ({commit, state}) {
    if (state.indexFilterData['equipmentScreenType'].length > 0) return
    getIndexFilterData().then(res => commit('setIndexFilterData', res))
  },
  /**
  * @Description: 更新购物车列表
  * @date 2019/9/25
  */
  updateShoppingCart ({state, commit}) {
    const adList = JSON.parse(localStorage.getItem(state.userInfo.userName + '-adShoppingCart')) || []
    commit('setAdShoppingCartList', adList)
  },
  /**
  * @Description: 添加广告到购物车
  * @date 2019/9/20  16:57
  */
  addAdShoppingCart ({commit, state}, payload) {
    const newAdList = payload instanceof Array ? payload : [payload]
    let adList = state.adShoppingCartList
    newAdList.forEach(item => {
      if (state.adShoppingCartList.findIndex(ad => ad.id === item.id) === -1) adList.unshift(item)
    })
    localStorage.setItem(state.userInfo.userName + '-adShoppingCart', JSON.stringify(adList))
    commit('setAdShoppingCartList', adList)
  },
  /**
  * @Description: 从购物车移除广告
  * @date 2019/9/20  16:58
  */
  removeAdShoppingCart ({commit, state}, payload) {
    // 获取需要移除的Id
    const ids = payload instanceof Array ? payload.map(item => item.id) : [payload.id]
    const adList = state.adShoppingCartList.filter(item => ids.indexOf(item.id) === -1)
    localStorage.setItem(state.userInfo.userName + '-adShoppingCart', JSON.stringify(adList))
    commit('setAdShoppingCartList', adList)
  },
  /**
 * @Description: 设置消息列表
 * @date 2019/9/23
 */
  updateMessageList ({commit, state}, payload = 1) {
    return new Promise((resolve, reject) => {
      getMessageList({
        pageNumber: payload,
        pageSize: 10
      }).then(res => {
        commit('setMessageList', payload === 1 ? res.rows : [...state.messageList, ...res.rows])
        resolve(res.rows)
      }, err => reject(err))
    })
  },
  updataBalanceMoney ({commit, state}) {
    getUserDetail().then(res => {
      commit('setBalanceMoney', res.money)
    })
  }
}
