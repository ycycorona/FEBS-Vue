import Vue from 'vue'
import Febs from './FEBS'
import router from './router'
import Antd from 'ant-design-vue'
import store from './store'
import request from 'utils/request'
import db from 'utils/localstorage'
import VueApexCharts from 'vue-apexcharts'
import VueAMap from 'vue-amap'
// mock
// import './mock'

import 'ant-design-vue/dist/antd.less'

import 'utils/install'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(db)
Vue.use(VueApexCharts)
// 高德地图
const amapKeys = Object.keys(localStorage).filter(key => key.match(/^_AMap_/))

amapKeys.forEach(key => {
  // console.log(key)
  localStorage.removeItem(key)
})

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '614fac7b5072ab20e6d7d4c600da8a7a',
  plugin: ['AMap.MarkerClusterer', 'AMap.Scale', 'AMap.ToolBar', 'AMap.MouseTool', 'AMap.CircleEditor',
    'AMap.Geocoder', 'AMap.Autocomplete'],
  v: '1.4.15' // 高德 sdk 版本为 1.4.4
  // uiVersion: '1.0.11' // 高德UI版本号
})
Vue.component('apexchart', VueApexCharts)

import '@/assets/style/less/Common.less'
Vue.use({
  install(Vue) {
    Vue.prototype.$db = db
  }
})

import '@/utils/filters'
Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$export = request.export
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(Febs)
}).$mount('#febs')
