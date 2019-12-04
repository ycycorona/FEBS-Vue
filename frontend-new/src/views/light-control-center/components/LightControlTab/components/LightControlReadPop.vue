<template>
  <a-tabs default-active-key="1" style="margin-top: -24px;">
    <a-tab-pane key="1" tab="安装参数" force-render>
      <install-params-form
        :detail-data="{}"
        :readonly="true"
        :is-edit="true"
        :edit-id="1"
      ></install-params-form>
    </a-tab-pane>
    <a-tab-pane key="2" tab="实时参数" force-render>
      <real-time-status
        :detail-data="{}"
      ></real-time-status>
    </a-tab-pane>
    <a-tab-pane key="3" tab="配置" force-render>
      <light-config
        :detail-data="{}"
      ></light-config>
    </a-tab-pane>
    <a-tab-pane key="4" tab="策略" force-render>
      <light-strategy
        :detail-data="{}"
      ></light-strategy>
    </a-tab-pane>
    <a-tab-pane key="5" tab="报警阈" force-render>
      <alarm-threshold
        :detail-data="{}"
      ></alarm-threshold>
    </a-tab-pane>
  </a-tabs>

</template>

<script>
import InstallParamsForm from '@/views/light-control-center/components/LightManageTab/components/LightManageDetailPop'
import RealTimeStatus from '@/views/light-control-center/components/LightControlTab/components/LightDetailTab/RealTimeStatus'
import LightConfig from '@/views/light-control-center/components/LightControlTab/components/LightDetailTab/LightConfig'
import LightStrategy from '@/views/light-control-center/components/LightControlTab/components/LightDetailTab/LightStrategy'
import AlarmThreshold from '@/views/light-control-center/components/LightControlTab/components/LightDetailTab/AlarmThreshold'
import { createArrayFromNum, configSerialize, configDeserialize } from '@/utils/common'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const formItemLayout_1 = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}
const formItemLayout_noLabel = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 }
}
export default {
  name: 'LightControlReadPop',
  components: { InstallParamsForm, RealTimeStatus, LightConfig, LightStrategy, AlarmThreshold },
  props: {
    detailData: {
      type: Object
    },
    readonly: {
      type: Boolean,
      default: true
    },
    isEdit: {
      default: false,
      type: Boolean
    },
    projectOpt: {
      type: Array
    },
    editId: {
      default: '',
      type: [String, Number]
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
  created() {
    this.$store.commit('contact/setCurrentPopContent', this)
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="less" scoped>

</style>
