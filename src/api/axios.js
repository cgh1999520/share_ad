import Axios from 'axios'
import {LoadingBar, Message} from 'iview'
// import router from '../router/index'
import config from '../config/index'
import qs from 'qs'

/**
 * @Description: json 数据 转 form Data 数据
 * @date 2019/5/13  16:06
 */
function objToFormData (obj) {
  return qs.stringify(obj)
  /* if (!obj) return new FormData()
  let formData = new FormData()
  Object.keys(obj).forEach(key => {
    formData.append(key, obj[key] !== undefined ? obj[key] : '')
  })
  return formData */
}

const axios = Axios.create({
  baseURL: config.BASE_URL, // 基本URL 地址，动态匹配
  timeout: 1000 * 30
})

// 状态码错误信息
const codeMessage = {
  4: '请求超时',
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 请求拦截器
axios.interceptors.request.use(config => {
  if (config.showLoading === undefined || config.showLoading === true) {
    LoadingBar.start()
  }
  /* 如果是上传，则设置超时为 1小时， 请求，则30秒 */
  if (config.upload === true) {
    config.timeout = 1000 * 60 * 60
  }
  // 格式化请求参数
  if (!config.data) config.data = {}
  config.data.token = sessionStorage.token || ''
  if (!(config.data instanceof FormData)) {
    if (config.requestType === undefined || config.requestType !== 'json') config.data = objToFormData(config.data)
  }
  return config
}, error => {
  LoadingBar.error()
  return Promise.reject(error)
})

// 返回结果拦截器
axios.interceptors.response.use(res => {
  let data = res.data
  LoadingBar.finish()

  // 如果当前的类型为 文件则直接返回数据
  if (res.config.type === 'file') {
    return data
  } else if (data.code !== 0) {
    errorManage(data)
    return Promise.reject(data)
  }
  return data.data
}, error => {
  // 判断当前是否要显示错误提示
  LoadingBar.error()
  if (error.config.showError === false) return Promise.reject(error)
  // 请求错误时，抛出异常提示
  Message.error({
    content: codeMessage[error.request ? error.request.readyState : error.response.status] || '未知错误'
  })
  return Promise.reject(error)
})

/**
 * @Description: 错误处理
 * @date 2019/5/7  1:20
 */
function errorManage (result) {
  switch (result.code) {
    case 400:
      Message.error('参数错误')
      break
    // case 201: // 错误码 201(账号已在别处登录，需要回到登录页)
    //   sessionStorage.clear()
    //   router.replace({
    //     path: '/auth/login'
    //   })
    //   break
  }

  // Message.error({
  //   content: result.message
  // })
}

export default axios
