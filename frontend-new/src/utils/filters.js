import Vue from 'vue'
const DeviceStatusDict = {
  '1': '在线',
  '0': '离线'
}
const DeviceStatusColorDict = {
  '1': 'blue',
  '0': 'red'
}

const StrategyToDeviceStatusDict = {
  '1': '已接收',
  '4': '已撤销',
  '6': '待接收',
  '8': '待撤销'
}

Vue.filter('deviceStatusFil', (val) => {
  return DeviceStatusDict[String(val)]
})
Vue.filter('deviceStatusColorFil', (val) => {
  return DeviceStatusColorDict[String(val)]
})

Vue.filter('strategyToDeviceStatusFil', (val) => {
  return StrategyToDeviceStatusDict[String(val)] || '其他'
})
