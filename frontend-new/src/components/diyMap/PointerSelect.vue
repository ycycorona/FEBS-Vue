<template>
  <div style="width: 100%;height:300px;position:relative">
    <!-- <div class="search-info-wrap">
      <a-input id="map-text-search" addon-before="输入位置关键字检索" />
    </div> -->
    <div style="width: 100%;height:300px" />
  </div>
</template>

<script>

import { lazyAMapApiLoaderInstance } from 'vue-amap'

export default {
  name: 'PointerSelect',
  props: {
    currentPointer: {
      type: Array
    }
  },
  data() {
    return {
      aMapIns: null,
      localCurrentPointer: null,
      geocoder: null,
      autocomplete: null,
      marker: null
    }
  },
  computed: {

  },
  watch: {
    currentPointer(newVal) {
      this.setCenterPoint(...newVal)
      this.updatePointer(...newVal)
    }
  },
  created() {

  },
  mounted() {
    lazyAMapApiLoaderInstance.load().then(() => {
      this.mapInit()
      this.$emit('map-init-success')
      // console.log('高德地图初始化完成')
      // eslint-disable-next-line
      this.mouseTool = new AMap.MouseTool(this.aMapIns)
      // eslint-disable-next-line
      this.geocoder = new AMap.Geocoder()
      // eslint-disable-next-line
      // this.autocomplete =  new AMap.Autocomplete({input: "map-text-search"})
      // this.autocomplete.on('select', ({ poi, type }) => {
      //   if (poi.location) {
      //     this.setCenterPoint(poi.location.lng, poi.location.lat)
      //   }
      // })
      this.setCenterPoint(...this.currentPointer)
      this.setSelectPointer(...this.currentPointer)
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
    //
    updatePointerByCityName(cityName) {
      this.aMapIns.setCity(cityName, () => {
        const centerPos = this.aMapIns.getCenter()
        const { lng, lat } = centerPos
        this.updatePointer(lng, lat)
      })
    },
    setSelectPointer(lng, lat) {
      const marker = new AMap.Marker({
        icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
        position: [lng, lat],
        offset: new AMap.Pixel(-13, -30),
        draggable: true
      })
      marker.on('dragend', (e) => {
        const { lng, lat } = e.lnglat
        this.emitPointerPosition(lng, lat)
      })
      this.marker = marker
      marker.setMap(this.aMapIns)
    },
    updatePointer(lng, lat) {
      this.marker.setPosition(new AMap.LngLat(lng, lat))
    },
    emitPointerPosition(lng, lat) {
      this.$emit('change', [lng, lat])
    },
    validateX(x) {
      if (isNaN(x)) { return false }
      // if (Math.abs(Number(x)) === 0) { return false }
      if (Math.abs(Number(x)) >= 180) { return false }
      return true
    },
    validateY(y) {
      if (isNaN(y)) { return false }
      // if (Math.abs(Number(y)) === 0) { return false }
      if (Math.abs(Number(y)) >= 90) { return false }
      return true
    },
    // 获取中心坐标地址
    getCenterAddressName() {
      return new Promise((resolve, reject) => {
        this.geocoder.getAddress([this.circleData.lng, this.circleData.lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            this.$emit('center-address', result.regeocode.formattedAddress)
            resolve(result.regeocode.formattedAddress)
          } else {
            reject('根据经纬度查询地址失败')
            console.error('根据经纬度查询地址失败')
          }
        })
      })
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
<style>
.amap-icon img{
    width: 25px;
    height: 34px;
}
</style>
