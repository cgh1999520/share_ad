import axios from '@/api/axios'

/**
 * @Description: 获取城市列表
 * @date 2019/9/11  14:08
 */
export function getCityList () {
  return axios.post('/dspManager/index/cityList')
}

/**
 * @Description: 获取首页筛选数据
 * @date 2019/9/11  14:08
 */
export function getIndexFilterData () {
  return axios.post('/dspManager/index/indexData')
}

/**
 * @Description: 获取首页层级数据
 * @date 2019/9/11  14:08
 */
export function getIndexLevelData (params) {
  return axios.post('/dspManager/index/hierarchyList', params)
}

/**
 * @Description: 获取首页点位数据
 * @date 2019/9/11  14:08
 */
export function getIndexPointData (params) {
  return axios.post('/dspManager/index/searchData', params)
}

/**
 * @Description: 获取首页 广告信息列表
 * @date 2019/9/11  14:08
 */
export function getIndexAdInfoList (params) {
  return axios.post('/dspManager/index/advertisingPositionData', params)
}

/**
 * @Description: 投放广告订单
 * @date 2019/9/11  14:08
 */
export function servingAdOrder (params) {
  return axios.post('/dspManager/advertisersOrder/creatOrder', params, {
    requestType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

/**
* @Description: 支付订单-微信
* @date 2019/9/27
*/
export function payOrder (params) {
  return axios.post('/dspManager/orderPay/weixinAdvBill', params)
}

/**
 * @Description: 支付订单-微信
 * @date 2019/9/27
 */
export function payOrderBalance (params) {
  return axios.post('/dspManager/orderPay/balanceAdvBill', params)
}

/**
* @Description: 充值
* @date 2019/9/27
*/
export function payRecharge (params) {
  return axios.post('/dspManager/orderPay/weixinBalanceRecharge', params)
}

/**
 * @Description: 查询订单状态(轮询)
 * @date 2019/9/27
 */
export function orderStatus (params) {
  return axios.post('/dspManager/orderPay/queryOrder', params)
}

/**
 * @Description: 查询订单状态(轮询)
 * @date 2019/9/27
 */
export function orderList (params) {
  return axios.post('/dspManager/advertisersOrder/orderList', params)
}

/**
 * @Description: 获取用户余额
 * @date 2019/9/27
 */
export function getUserBalance (params) {
  return axios.post('/dspManager/WalletDetail/list', params)
}

/**
 * @Description: 查看订单详情
 * @date 2019/9/27
 */
export function getOrderDetail (params) {
  return axios.post('/dspManager/advertisersOrder/orderDetails', params)
}

/**
 * @Description: 删除订单
 * @author LC
 * @date 2019/10/17
*/
export function deleteOrder (params) {
  return axios.post('/dspManager/advertisersOrder/orderDelete', params)
}

/**
 * @Description: 数据统计数据
 * @author LC
 * @date 2019/10/17
*/
export function dataStatistics (params) {
  return axios.post('/dspManager/advertisersOrder/userShowNumber', params)
}
