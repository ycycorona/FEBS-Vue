import Vue from 'vue'
const DeviceStatusDict = {
  '1': '在线',
  '0': '离线'
}
const DeviceStatusColorDict = {
  '1': 'blue',
  '0': 'red'
}

Vue.filter('deviceStatusFil', (val) => {
  return DeviceStatusDict[String(val)]
})
Vue.filter('deviceStatusColorFil', (val) => {
  return DeviceStatusColorDict[String(val)]
})
