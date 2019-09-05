<template>
  <div style="width: 100%;height:400px;position:relative">
    <div style="width: 100%;height:400px" />
  </div>
</template>

<script>
import { lazyAMapApiLoaderInstance } from 'vue-amap'
function rowFactory(label, value) {
  const row = document.createElement('div')
  const spanLabel = document.createElement('span')
  const spanValue = document.createElement('span')
  spanLabel.classList.add('span-label')
  spanValue.classList.add('span-value')
  spanLabel.innerHTML = label
  spanValue.innerHTML = value
  row.append(spanLabel)
  row.append(spanValue)
  return row
}
export default {
  name: 'HomeMap',
  components: { },
  props: {
    example: {
      default: false,
      type: Boolean
    },
    fenceList: {
      type: Array,
      default: () => []
    },
    phoneList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      aMapIns: null,
      currentCircle: null,
      geocoder: null,
      mapCircleList: [],
      mapPhoneList: [],
      onlinePhone: null,
      offlinePhone: null,
      alarmPhone: null,
      infoWindow: null
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
      this.$nextTick(() => {
        setTimeout(() => {
          this.mapInit()
          this.$emit('map-init-success')
          console.log('高德地图初始化完成')
          this.drawFenceList()

          this.geocoder = new AMap.Geocoder()

          // 创建 icon
          this.onlinePhone = new AMap.Icon({
            size: new AMap.Size(26, 34),
            image: '/static/img/map_online_phone.png'
            // imageSize: new AMap.Size(135, 40),
            // imageOffset: new AMap.Pixel(-95, -3)
          })
          this.offlinePhone = new AMap.Icon({
            size: new AMap.Size(26, 34),
            image: '/static/img/map_offline_phone.png'
          })
          this.alarmPhone = new AMap.Icon({
            size: new AMap.Size(26, 34),
            image: '/static/img/map_unhandled_alarm_phone.png'
          })
          this.infoWindow = new AMap.InfoWindow({
            content: '123'
          })
          this.drawPhoneList()
        }, 300)
      })
    })
  },
  methods: {
    mapInit() {
      this.aMapIns = new AMap.Map(this.$el, {
        resizeEnable: true, // 是否监控地图容器尺寸变化
        zoom: 15
        // mapStyle: 'amap://styles/light'
      })

      const scale = new AMap.Scale({
        visible: true
      })

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
    drawFenceList() {
      this.fenceList.forEach((item) => {
        this.mapCircleList.push(this.addFenceFromParams(item.centerLng, item.centerLat, item.radius))
      })
      this.aMapIns.setFitView()
    },
    drawPhoneList() {
      this.phoneList.forEach(item => {
        if (item.lat && item.lng) {
          this.mapPhoneList.push(this.addPhone(item.lng, item.lat, item.lastState, item.id))
        }
      })

      new AMap.MarkerClusterer(
        this.aMapIns, // 地图实例
        this.mapPhoneList, // 海量点组成的数组
        {
          gridSize: 80,
          maxZoom: 15, // 多少缩放级别时 停止聚合
          averageCenter: false,
          renderCluserMarker: this.renderCluserMarkerFactory(this.mapPhoneList)
        }
      )
    },
    renderCluserMarkerFactory(markers) {
      return context => {
        const colorHSLA = [202, '100%', '48%', 1]
        const circleStrokeColor = '#009df7'
        const count = markers.length
        const fullColorFactor = 1 / 5 // 达到总点数的多少比例 显示为全色
        let factor
        if (context.count > count * fullColorFactor) {
          factor = 1
        } else {
          factor = context.count / (count * fullColorFactor)
        }
        const div = document.createElement('div')
        // this.array.push([context.count, count, Hue, factor]);
        colorHSLA[3] = 0.2 + 0.8 * factor
        const bgColor = `HSLA(${colorHSLA.join(',')})`
        const fontColor = 'hsla(0,0%,0%,1)'
        const borderColor = circleStrokeColor
        const shadowColor = circleStrokeColor
        div.style.backgroundColor = bgColor
        const size = Math.round(8 + Math.pow(context.count / count, 1 / 5) * 20) // 聚合点图形尺寸
        div.style.width = div.style.height = size + 'px'
        div.style.border = 'solid 1px ' + borderColor
        div.style.borderRadius = size / 2 + 'px'
        div.style.boxShadow = '0 0 1px ' + shadowColor
        div.innerHTML = context.count
        div.style.lineHeight = size + 'px'
        div.style.color = fontColor
        div.style.fontSize = '12px'
        div.style.textAlign = 'center'
        context.marker.setOffset(new AMap.Pixel(-size / 2, -size / 2))
        context.marker.setContent(div)
      }
    },
    // 地图添加手机
    addPhone(lng, lat, state, id) {
      const stateMapArray = [null, this.offlinePhone, this.alarmPhone, this.onlinePhone]
      // 将 icon 传入 marker
      const endMarker = new AMap.Marker({
        position: new AMap.LngLat(lng, lat),
        icon: stateMapArray[state]
        // offset: new AMap.Pixel(100, 100)
      })
      endMarker.on('click', this.markerClick.bind(this, id))
      return endMarker
      // return this.aMapIns.add(endMarker)
    },
    async markerClick(id, e) {
      this.infoWindow.setContent('')
      const phoneDetail = await this.getLabelDetail(id)
      // console.log(phoneDetail)
      const content = document.createElement('div')

      const userNameRow = rowFactory('用户：', phoneDetail.username)
      const linestateRow = rowFactory('设备状态：', phoneDetail.linestate)
      const strategyNameRow = rowFactory('设备策略：', phoneDetail.strategyName)
      const phoneNumberRow = rowFactory('手机号：', phoneDetail.phoneNumber)
      content.append(userNameRow)
      content.append(linestateRow)
      content.append(strategyNameRow)
      content.append(phoneNumberRow)
      this.infoWindow.setContent(content)
      this.infoWindow.open(this.aMapIns, e.target.getPosition())
    },
    // 获取手机详情
    getLabelDetail(phoneId) {
      return new Promise((resolve, reject) => {
        this.$get('/business/index/getPhoneForWindowById', {
          phoneId: phoneId
        })
          .then(res => {
            if (res.data.state === 1) {
              resolve(res.data.data)
            } else {
              reject(res.data.message)
            }
          })
          .finally(() => {

          })
      })
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
      circle.setMap(this.aMapIns)
      return circle
    }
  }
}
</script>

<style lang="less" scoped>

</style>
