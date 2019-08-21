<template>
  <div style="width: 100%;height:500px;position:relative">
    <div class="search-info-wrap">
      <a-input id="map-text-search" addon-before="请输入关键字" />
    </div>
    <div style="width: 100%;height:500px" />
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
  name: 'ElectricFenceMap',
  props: {

  },
  data() {
    return {
      aMapIns: null,
      currentCircle: null,
      mouseTool: null,
      circleEditor: null,
      isEditCircleToolOn: false,
      circleData: {
        lng: '',
        lat: '',
        radius: ''
      },
      geocoder: null,
      autocomplete: null
    }
  },
  computed: {

  },
  watch: {
    currentCircle(newVal) {
      if (newVal) {
        this.$emit('have-current-circle')
      } else {
        this.$emit('no-current-circle')
      }
    },
    circleData() {
      this.geocoder.getAddress([this.circleData.lng, this.circleData.lat], (status, result) => {
        console.log(status, result)
        if (status === 'complete' && result.regeocode) {
          console.log(status, result)
          this.$emit('fence-change', Object.assign({}, this.circleData, { formattedAddress: result.regeocode.formattedAddress }))
        } else {
          console.error('根据经纬度查询地址失败')
        }
      })
    }
  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapInit()
      this.$emit('map-init-success')
      console.log('高德地图初始化完成')
      // eslint-disable-next-line
      this.mouseTool = new AMap.MouseTool(this.aMapIns)
      // eslint-disable-next-line
      this.geocoder = new AMap.Geocoder()
      // eslint-disable-next-line
      this.autocomplete =  new AMap.Autocomplete({input: "map-text-search"})
      this.autocomplete.on('select', ({ poi, type }) => {
        if (poi.location) {
          this.setCenterPoint(poi.location.lng, poi.location.lat)
        }
      })
      // 画圈完成回调函数
      // eslint-disable-next-line
      AMap.event.addListener(this.mouseTool, 'draw', (e) => {
        this.currentCircle = e.obj
        this.mouseTool.close()
        this.aMapIns.setDefaultCursor()
        this.$emit('add-circle-tool-off')
        this.currentCircle.setRadius(Math.round(this.currentCircle.getRadius()))
        this.circleChange({ lng: this.currentCircle.getCenter().getLng(),
          lat: this.currentCircle.getCenter().getLat(),
          radius: this.currentCircle.getRadius() })
      })
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
    },
    // 激活画圈插件
    activeAddCircleTool() {
      this.aMapIns.setDefaultCursor('crosshair')
      this.mouseTool.circle()
      this.$emit('add-circle-tool-on')
    },
    // 激活编辑圈的插件
    activeEditCircleTool() {
      if (!this.currentCircle) {
        this.$message.error('请先在地图上添加围栏')
        return
      }
      // eslint-disable-next-line
      this.circleEditor = new AMap.CircleEditor(this.aMapIns, this.currentCircle)
      this.circleEditor.on('end', (e) => {
        this.circleChange({ lng: this.currentCircle.getCenter().getLng(),
          lat: this.currentCircle.getCenter().getLat(),
          radius: this.currentCircle.getRadius() })
      })
      this.circleEditor.open()
      this.isEditCircleToolOn = true
      this.$emit('circle-editor-on')
    },
    // 取消激活编辑圈的插件
    deActiveEditCircleTool() {
      this.circleEditor.close()
      this.isEditCircleToolOn = false
      this.$emit('circle-editor-off')
    },
    // 从地图移除当前圆圈，并消除变量引用
    delCurrentCircle() {
      if (!this.currentCircle) { return }
      if (this.isEditCircleToolOn) {
        this.deActiveEditCircleTool()
      }
      this.currentCircle.setMap(null)
      this.currentCircle = null
    },
    // 设置圆属性
    manualChangeCircle({ lng, lat, radius }) {
      console.log(lng, lat, radius)
      this.currentCircle.setOptions({
        // eslint-disable-next-line
        radius, center: new AMap.LngLat(lng, lat)
      })
      this.circleChange({ lng, lat, radius })
    },
    circleChange(obj) {
      // lng, lat, radius
      const emptyObj = {}
      Object.assign(emptyObj, this.circleData, obj)
      this.circleData = emptyObj
    },
    // 从参数新建圆圈
    addFenceFromParams(lng, lat, radius) {
      // eslint-disable-next-line
      const circle = new AMap.Circle({
        // eslint-disable-next-line
        center: new AMap.LngLat(lng, lat), // 圆心位置
        radius: radius, // 半径
        strokeColor: '#1791fc',
        strokeOpacity: 0.8,
        strokeDasharray: [10, 5],
        strokeWeight: 2,
        strokeStyle: 'solid',
        fillColor: '#1791fc',
        fillOpacity: 0.35
      })
      if (this.currentCircle) {
        this.delCurrentCircle()
      }
      circle.setMap(this.aMapIns)
      this.setCenterPoint(Number(lng), Number(lat))
      this.currentCircle = circle
    }
  }
}
</script>

<style>

</style>

<style lang="less" scoped>
.search-info-wrap {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 10px;
  box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
  border-width: 0;
  border-radius: .25rem;
  background-color: #ffffff;
  z-index: 1;
}
</style>
