<template>
  <SingleMenuWrap>
    <div class="full-width light-control-center-index-wrap table-page-search-wrapper">
      <!-- 表单区域 -->
      <a-form layout="inline" :form="functionSelectForm">
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item
              label="项目"
            >
              <a-select
                v-decorator="['project']"

                placeholder="请选择项目"
                allow-clear
              >
                <a-select-option :value="0">项目1</a-select-option>
                <a-select-option :value="1">项目2</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <a-form-item
              label="设备"
            >
              <a-select
                v-decorator="['deviceType', {
                  initialValue: 0
                }]"
                placeholder="请选择设备类型"
                allow-clear
              >
                <a-select-option :value="0">智能灯</a-select-option>
                <a-select-option :value="1">网关</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <a-tabs default-active-key="controlTab" class="full-width-tab" @change="onTabChange">
        <a-tab-pane key="controlTab" :tab="currentControlDeviceName + '控制'">
          kongzhi
        </a-tab-pane>
        <a-tab-pane key="manageTab" :tab="currentControlDeviceName + '管理'">
          <LightManageTab></LightManageTab>
        </a-tab-pane>
      </a-tabs>
    </div>
  </SingleMenuWrap>
</template>

<script>

import SingleMenuWrap from '@/views/common/SingleMenuWrap'
import LightManageTab from './components/LightManageTab/LightManageTab'
import { LightName, GatewayName } from '@/config/LightConstant'
export default {
  name: 'LightControlCenterIndex',
  components: { SingleMenuWrap, LightManageTab },
  props: {

  },
  data() {
    return {
      Cons: {
        LightName, GatewayName
      },
      functionSelectForm: this.$form.createForm(this),
      loading: false,
      strategyOpt: [],
      currentControlDeviceName: LightName
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
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
    fetch(params = {}) {
      // 显示loading
      this.loading = true
      this.loading = false
      console.log(params)
      // this.$get('/business/alarm/getAlarmListByPage', {
      //   ...params
      // })
      //   .then((r) => {
      //     const data = r.data
      //   })
      //   .finally(() => {
      //     this.loading = false
      //   })
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
