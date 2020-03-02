/**
 * @Description: 验证密码 是 长度(6 - 21)的英数组合密码。

 * @date 2019/3/26  14:49
 */
export const validPassword = (rule, value, callback) => {
  let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,900}$/
  if (!value) {
    callback(new Error('请输入密码'))
    return
  } else if (!regExp.test(value)) {
    callback(new Error('需密码长度大于6的英数组合密码，不包含特殊字符。'))
    return
  }
  callback()
}

/**
 * @Description:  正则验证手机号是否正确

 * @date 2019/4/8  13:55
 */
export const validPhoneNum = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请输入手机号'))
    return
  } else if (!/^1[345789]\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号'))
    return
  }
  callback()
}
