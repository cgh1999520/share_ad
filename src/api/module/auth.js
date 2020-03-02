import axios from '../axios'

/**
 * @Description: 注册检查用户名是否存在
 * @date 2019/9/10  17:15
*/
export function userNameRepeat (params) {
  return axios.post('/dspManager/admin/userName', params)
}

/**
 * @Description: 用户注册
 * @date 2019/9/11  9:52
*/

export function userRegister (params) {
  return axios.post('/dspManager/admin/register', params)
}

/**
 * @Description: 用户登录
 * @date 2019/9/11  9:52
*/

export function userLogin (params) {
  return axios.post('/dspManager/admin/login', params)
}

/**
 * @Description: 找回密码
 * @date 2019/9/11  9:52
*/

export function retrievePassword (params) {
  return axios.post('/dspManager/admin/passWord', params)
}
