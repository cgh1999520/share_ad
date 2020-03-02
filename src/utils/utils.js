import lodash from 'lodash'
/**
 * @Description: 复制一个新的对象，防止浅拷贝，更改到源数据
 * @date 2019/5/10  9:46
 * @param obj {Object} 需要复制的对象
 * @return  templateObj {Object} 模板对象，如果存在，则返回只模板有的数据
 */
export function copyObj (obj, templateObj) {
  if (!obj) throw Error('Not obj Param ')
  let _obj = lodash.cloneDeep(obj)
  // 如果存在
  if (templateObj) {
    Object.keys(templateObj).forEach(key => {
      let isExist = !(_obj[key] === null || _obj[key] === undefined)
      templateObj[key] = isExist ? _obj[key] : ''
    })
    return templateObj
  }
  return _obj
}

/**
 * @Description: 对象初始化值
 * @date 2019/5/10  9:35
 * @param _obj {Object} 需要初始化值的对象
 * @param not {Array} 不需要初始化的数据
 * @return {Object}
 */
export function resetObjParam (_obj, not = []) {
  if (!_obj) throw Error('Not obj Param ')
  let obj = copyObj(_obj)
  if (obj instanceof Array) {
    return []
  }
  Object.keys(obj).forEach(key => {
    if (not.indexOf(key) !== -1) return
    if (obj[key] instanceof Array) {
      obj[key] = []
      return
    } else if (obj[key] instanceof Object) {
      resetObjParam(obj[key])
      return
    }
    obj[key] = ''
  })
  return obj
}

/**
 * @Description: 数据过滤器
 * @date 2019/5/20  10:53
 *@param data {Array} 处理数据
 * @param filter {Object} 需要过滤的数据
 *  filter: { // 示例数据
 *    sex: [{key: '0', name: '女'}, {key: '1': name: '男'}]
 *  }
 */
export function dataFilterReform (data, filter) {
  let keys = Object.keys(filter)
  if (keys.length === 0) return data
  // 1. 遍历源数据
  // 2. 遍历需要过滤数据的key
  // 3. 通过表达式[key]对应到 源数据item , 然后定位 需要过滤的数据的name 值
  data.forEach(item => {
    keys.forEach(key => {
      let filterVal = filter[key].find(i => item[key] == i.key)// eslint-disable-line
      if (filterVal) {
        item[key + 'Old'] = item[key]
        item[key] = filterVal.name
      }
    })
  })
  return data
}
