<template>
  <SingleMenuWrap>
    <div class="full-width light-control-center-index-wrap table-page-search-wrapper">

      <a-tabs default-active-key="lightControlTab" class="full-width-tab" @change="onTabChange">
        <a-tab-pane key="lightControlTab" tab="智能灯控制">
          <light-control-tab></light-control-tab>
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
import GatewayManageTab from './components/GatewayManageTab/GatewayManageTab'

export default {
  name: 'LightControlCenterIndex',
  components: { SingleMenuWrap, LightManageTab, LightControlTab, GatewayManageTab },
  props: {

  },
  data() {
    return {
      currentProject: 0,
      currentDeviceType: 0,
      currentGroup: 0,
      functionSelectForm: this.$form.createForm(this),
      loading: false,
      strategyOpt: []
      // currentControlDeviceName: LightName
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
    search() {
      const values = this.filterForm.getFieldsValue()
      const params = {
        deptId: values.dept,
        userName: values.username
      }
      if (values.dateRange) {
        params.startDate = values.dateRange[0].format('YYYY-MM-DD')
        params.endDate = values.dateRange[1].format('YYYY-MM-DD')
      }
      this.fetch(Object.assign(params, { pageSize: 10, pageNum: 1 }))
    },
    resetFilterForm() {
      this.filterForm.resetFields()
    },
    onTabChange() {

    }
  }
}
</script>

<style lang="less" scoped>
.left-align {
  text-align: left
}

.flex-wrap {
  display: flex
}
.flex-item {
  flex: 1 1 auto
}
.time-format {
  color: #919191;
  font-size: 12px
}
</style>
