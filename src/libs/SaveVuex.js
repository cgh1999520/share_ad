/**
 * @Description: 防止浏览器刷新时，丢失 Vuex 的数据。
 * @date 2019/3/26  9:40
 * @param storeObj: Vuex 对象。
 */
export default function (storeObj) {
  // 1.判断当前是否存在储存的 state 信息
  // 2.如果存在state 的内容则恢复数据。
  // 3.取出数据后，则移除储存，防止信息泄露。
  let store = sessionStorage.getItem('vuex-state')
  if (store) {
    storeObj.replaceState(JSON.parse(store))
    sessionStorage.removeItem('vuex-state')
  }

  // 监听浏览器刷新事件，保存state 数据
  window.onbeforeunload = () => {
    sessionStorage.setItem('vuex-state', JSON.stringify(storeObj.state))
  }
}
