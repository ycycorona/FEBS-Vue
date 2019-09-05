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
  '0': '待接收',
  '1': '待撤销',
  '2': '已接收'
  // '3': '待撤销',
  // '4': '已撤销',
  // '5': '已撤销',
  // '6': '待接收',
  // '7': '已接收',
  // '8': '待接收',
  // '9': '已撤销',
  // '10': '已过期'
}

const alarmDealStatusDict = {
  '0': '未处理',
  '1': '已处理'
}

const fenceTypeDict = {
  '0': '内',
  '1': '外'
}

Vue.filter('deviceStatusFil', (val) => {
  return DeviceStatusDict[String(val)]
})

Vue.filter('deviceStatusColorFil', (val) => {
  return DeviceStatusColorDict[String(val)]
})

Vue.filter('strategyToDeviceStatusFil', (val, type) => {
  return StrategyToDeviceStatusDict[String(val)] || '其他'
})

Vue.filter('alarmDealStatusFil', (val) => {
  return alarmDealStatusDict[String(val)]
})

Vue.filter('fenceTypeFil', (val) => {
  return fenceTypeDict[String(val)]
})
