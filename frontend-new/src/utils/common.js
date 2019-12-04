export function triggerWindowResizeEvent() {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * @desc 把配置项数组转字符串
 * @param {Array} arr
 */
export function configSerialize(arr) {
  if (!(arr instanceof Array)) {
    throw Error('参数不是数组')
  }
  return arr.join(',')
}

/**
 * @desc 把配置项字符串转数组
 * @param {String} str
 */
export function configDeserialize(str) {
  if (typeof str !== 'string') {
    throw Error('参数不是字符串')
  }
  return str.split(',').map(item => Number(item))
}

/**
 * @desc 把配置项数组转字符串
 * @param {Array} arr
 */
export function timeRangeSerialize(array) {
  if (!array) { return '' }
  return array.map(item => item.join('-')).join(',')
}

/**
 * @desc 把配置项字符串转数组
 * @param {String} str
 */
export function timeRangeDeserialize(str) {
  if (!str) { return [['00:01', '23:59']] }
  return str.split(',').map(item => item.split('-'))
}

export function optToArrayMap(arr) {
  return arr.reduce((accumulator, item) => {
    accumulator[item.value] = item.label
    return accumulator
  }, [])
}

/**
 * @desc 根据数据创造数组
 */
export function createArrayFromNum(number, init = '') {
  const array = []
  const value = typeof init === 'function' ? init() : init
  for (let i = 0; i < number; i++) {
    array.push(value)
  }
  return array
}

export function arrayToMapByKey(array, key) {
  const m = {}
  array.forEach(item => {
    m[item[key]] = item
  })
  return m
}
/**
 * @desc 判断是否是空值
 * 注意：0不属于空值
 * @param {number|string} val
 */
export function isEmptyValue(val) {
  let flag = false
  if (val === undefined || val === null || val === '') {
    flag = true
  }
  return flag
}

/**
 * @desc 判断是否是空值
 * 注意：0属于空值
 * @param {number|string} val
 */
export function isEmptyValueWith0(val) {
  let flag = false
  if (val === undefined || val === null || val === '' || val === 0) {
    flag = true
  }
  return flag
}

/**
 * @desc 判断是否是空对象
 * @param {object} obj
 */
export function isEmptyObject(obj) {
  if (!(obj instanceof Object)) { return false }
  return Object.keys(obj).length === 0
}

