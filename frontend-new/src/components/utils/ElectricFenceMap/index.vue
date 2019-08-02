<template>
  <div style="width: 100%;height:500px" />
</template>

<script>
import VueAMap from 'vue-amap'
import Vue from 'vue'
import { lazyAMapApiLoaderInstance } from 'vue-amap'
// 高德地图
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '614fac7b5072ab20e6d7d4c600da8a7a',
  plugin: ['Scale', 'ToolBar', 'MouseTool', 'CircleEditor'],
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
      }
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
    }
  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapInit()
      this.$emit('map-init-success')
      console.log('高德地图初始化完成')
      // eslint-disable-next-line
      this.mouseTool = new AMap.MouseTool(this.aMapIns)

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
      this.circleEditor.on('move', (e) => {
        this.circleChange({ lng: e.lnglat.lng, lat: e.lnglat.lat })
      })
      this.circleEditor.on('adjust', (e) => {
        this.circleChange({ radius: e.radius })
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
      if (this.isEditCircleToolOn) {
        this.deActiveEditCircleTool()
      }
      this.currentCircle.setMap(null)
      this.currentCircle = null
      this.$emit('no-current-circle')
    },
    circleChange(obj) {
      // lng, lat, radius
      Object.assign(this.circleData, obj)
      console.log(this.circleData)
    }
  }
}
</script>

<style>

</style>

<style lang="scss" scoped>

</style>
