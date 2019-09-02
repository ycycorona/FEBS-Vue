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
  if (!arr) { return '' }
  return arr.join(',')
}

/**
 * @desc 把配置项字符串转数组
 * @param {String} str
 */
export function configDeserialize(str) {
  if (!str) { return [] }
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
