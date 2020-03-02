import axios from '../axios'
/**
 * @Description: 发送手机短信验证码
 * @date 2019/9/11  9:53
*/
export function sendPhoneMsmCode (params, type) {
  return axios.post(type === 'register' ? '/dspManager/admin/sendSms' : '/dspManager/admin/sendSms', params)
}

/**
 * @Description: 上传文件
 * @date 2019/9/11  11:12
*/
export function uploadFile (file) {
  return axios.post('/dspManager/file/uploadMoreImage', {file}, {
    upload: true
  })
}

/**
 * @Description: 公用获取列表
 * @date 2019/9/11  11:29
*/
export function commonGetList (url, params) {
  return axios.post(`/${url}/list`, params)
}

/**
 * @Description: 公用列表删除
 * @date 2019/9/11  11:29
*/
export function commonDeleteRecord (url, params) {
  return axios.post(`/${url}/delete`, params)
}
