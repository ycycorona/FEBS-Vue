<template>
  <SingleMenuWrap>
    <div class="full-width light-control-center-index-wrap table-page-search-wrapper">
      <a-tabs :default-active-key="defaultActiveKey" class="full-width-tab" @change="onTabChange">
        <a-tab-pane key="lightControlTab" tab="智能灯控制(单灯)">
          <light-control-tab></light-control-tab>
        </a-tab-pane>
        <a-tab-pane key="lightControlByGroupTab" tab="智能灯控制(编组)">
          <light-control-by-group-tab></light-control-by-group-tab>
        </a-tab-pane>
        <a-tab-pane key="lightManageTab" tab="智能灯管理">
          <light-manage-tab></light-manage-tab>
        </a-tab-pane>
        <a-tab-pane key="gatewayManageTab" tab="网关管理控制">
          <gateway-manage-tab></gateway-manage-tab>
        </a-tab-pane>
      </a-tabs>
    </div>
  </SingleMenuWrap>
</template>
<script>
import SingleMenuWrap from '@/views/common/SingleMenuWrap'
import LightManageTab from './components/LightManageTab/LightManageTab'
import LightControlTab from './components/LightControlTab/LightControlTab'
// import LightControlByGroupTab from './components/LightControlTab/LightControlByGroupTab'
import GatewayManageTab from './components/GatewayManageTab/GatewayManageTab'

export default {
  name: 'LightControlCenterIndex',
  components: { SingleMenuWrap, LightManageTab, LightControlTab, GatewayManageTab },
  props: {
    defaultActiveKey: {
      type: String,
      default: 'gatewayManageTab'
    }
  },
  data() {
    return {
    }
  },
  computed: {

  },
  watch: {
    currentProject(newVal, oldVal) {

    },
    currentDeviceType(newVal, oldVal) {

    }
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
// .left-align {
//   text-align: left
// }

// .flex-wrap {
//   display: flex
// }
// .flex-item {
//   flex: 1 1 auto
// }
// .time-format {
//   color: #919191;
//   font-size: 12px
// }
</style>
