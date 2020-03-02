import axios from '../axios'

/**
 * @Description: 更新会员信息
 * @date 2019/9/11  11:16
*/
export function updateMemberInfo (params) {
  return axios.post('/dspManager/advertisersUser/updateUserDetails', params)
}

/**
 * @Description: 更新会员密码
 * @date 2019/9/11  11:16
*/
export function updatePassWord (params) {
  return axios.post('/dspManager/advertisersUser/updatePassWord', params)
}

/**
 * @Description: 获取会员认证信息
 * @date 2019/9/11  11:16
*/
export function getMemberAuthInfo () {
  return axios.post('/dspManager/advertisersUser/getAuth')
}

/**
 * @Description: 会员认证
 * @date 2019/9/11  11:16
*/
export function memberAuth (params) {
  return axios.post('/dspManager/advertisersUser/updateAuth', params)
}

/**
 * @Description: 更新会员手机号
 * @date 2019/9/11  11:16
*/
export function updateMemberPhone (params) {
  return axios.post('/dspManager/advertisersUser/updatePhone', params)
}

/**
 * @Description: 提交反馈
 * @date 2019/9/17  9:53
*/
export function saveFeedback (params) {
  return axios.post('/dspManager/feedback/saveFeedback', params)
}

/**
 * @Description: 获取消息列表
 * @date 2019/9/17  9:53
*/
export function getMessageList (params) {
  return axios.post('/dspManager/message/list', params)
}

/**
 * @Description: 设置消息已读
 * @date 2019/9/17  9:53
*/
export function setMessageRead (params) {
  return axios.post('/dspManager/message/read', params)
}

/**
 * @Description: 删除消息
 * @date 2019/9/17  9:53
 */
export function deleteMessage (params) {
  return axios.post('/dspManager/message/delete', params)
}

/**
 * @Description: 删除消息
 * @date 2019/9/17  9:53
 */
export function getUserDetail (params) {
  return axios.post('/dspManager/advertisersUser/getUserDetails', params)
}
