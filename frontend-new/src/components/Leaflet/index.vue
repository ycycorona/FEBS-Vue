<template>
  <div>
    <div id="mapid"></div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet/dist/leaflet.js'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})
export default {
  name: 'LeafletTest',
  components: { },
  props: {
    example: {
      default: false,
      type: Boolean
    }

  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  mounted() {
    const bounds = [[0, 0], [500, 500]]
    const mymap = L.map('mapid', {
      minZoom: -1,
      maxZoom: 4,
      center: [250, 250],
      zoom: 0,
      crs: L.CRS.Simple,
      maxBounds: bounds
    })
    // const image = L.imageOverlay('http://d.5857.com/tc_170411/001.jpg', bounds).addTo(mymap)
    // mymap.fitBounds(bounds)
    const marker = L.marker([0, 0], {
      zIndexOffset: 1000,
      draggable: true
    }).addTo(mymap)
    marker.on('move', function(ev) {
      console.log(ev)
    })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
#mapid { height: 600px; width: 600px}
</style>
