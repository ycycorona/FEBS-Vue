<template>
  <div style="width: 100%;height:400px;position:relative">
    <div style="width: 100%;height:400px" />
  </div>
</template>

<script>
import VueAMap from 'vue-amap'
import Vue from 'vue'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
// 高德地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '614fac7b5072ab20e6d7d4c600da8a7a',
  plugin: ['Scale', 'ToolBar', 'MouseTool', 'CircleEditor', 'Geocoder', 'Autocomplete'],
  v: '1.4.10' // 高德 sdk 版本为 1.4.4
  // uiVersion: '1.0.11' // 高德UI版本号
})
export default {
  name: 'HomeMap',
  components: { },
  props: {
    example: {
      default: false,
      type: Boolean
    }

  },
  data() {
    return {
      aMapIns: null,
      currentCircle: null,
      geocoder: null
    }
  },
  computed: {

  },
  watch: {

  },
  beforeCreate() {

  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapInit()
      this.$emit('map-init-success')
      console.log('高德地图初始化完成')
      // eslint-disable-next-line
    this.geocoder = new AMap.Geocoder()
    })
  },
  methods: {
    mapInit() {
      // eslint-disable-next-line
      this.aMapIns = new AMap.Map(this.$el, {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 15
        // mapStyle: 'amap://styles/light'
      })
      // eslint-disable-next-line
      const scale = new AMap.Scale({
        visible: true
      })
      // eslint-disable-next-line
      const toolBar = new AMap.ToolBar({
        visible: true
      })
      this.aMapIns.addControl(scale) // 添加比例尺
      this.aMapIns.addControl(toolBar) // 添加工具栏
    },
    // 设置地图中心点
    setCenterPoint(lng, lat) {
      this.aMapIns.setCenter([lng, lat])
    }
  }
}
</script>

<style lang="less" scoped>

</style>
