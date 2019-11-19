<template>
  <div class="full-width light-control-center-index-wrap table-page-search-wrapper">
    <a-tabs default-active-key="gateway" class="full-width-tab" @change="onTabChange">
      <a-tab-pane key="gateway" tab="网关固件">
        <GatewayFirmwareTab></GatewayFirmwareTab>
      </a-tab-pane>
      <a-tab-pane key="light" tab="控制器固件">
        <LightFirmwareTab></LightFirmwareTab>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import GatewayFirmwareTab from './components/GatewayFirmwareTab'
import LightFirmwareTab from './components/LightFirmwareTab'
export default {
  name: 'FirmwareManage',
  components: { GatewayFirmwareTab, LightFirmwareTab },
  props: {

  },
  data() {
    return {
      currentTab: ''
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {

  },
  methods: {
    onTabChange() {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
