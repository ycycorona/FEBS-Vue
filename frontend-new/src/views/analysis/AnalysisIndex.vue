<template>
  <SingleMenuWrap>
    <div class="full-width analysis-index-wrap table-page-search-wrapper">
      <!-- 表单区域 -->
      <a-form layout="inline" :form="filterForm">
        <a-row :gutter="24">
          <a-col :span="8" :xl="6">
            <a-form-item
              label="用户名"
            >
              <a-input
                v-decorator="[
                  'username'
                ]"
                placeholder="请输入用户名"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <a-form-item
              label="组织架构"
              :label-col="{span: 8}"
              :wrapper-col="{span: 16}"
            >
              <DeptInputTree
                v-decorator="[
                  'dept'
                ]"
              ></DeptInputTree>
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <a-form-item label="日期">
              <a-range-picker
                v-decorator="['dateRange']"
              >
              </a-range-picker>
            </a-form-item>
          </a-col>
          <a-col :span="8" :xl="6">
            <span>
              <a-button style="margin-left: 15px" type="primary" @click="search">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetFilterForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格区域 -->
      <a-row :gutter="24">
        <a-col :span="12" :xl="8">1</a-col>
        <a-col :span="12" :xl="8">2</a-col>
        <a-col :span="12" :xl="8">3</a-col>
        <a-col :span="12" :xl="8">4</a-col>
        <a-col :span="12" :xl="8">5</a-col>
        <a-col :span="12" :xl="8">6</a-col>
      </a-row>
    </div>
  </SingleMenuWrap>
</template>

<script>

import DeptInputTree from '@/views/system/dept/DeptInputTree'
import SingleMenuWrap from '@/views/common/SingleMenuWrap'
export default {
  name: 'AnalysisIndex',
  components: { DeptInputTree, SingleMenuWrap },
  props: {

  },
  data() {
    return {
      filterForm: this.$form.createForm(this),
      loading: false,
      strategyOpt: []
    }
  },
  computed: {

  },
  watch: {

  },
  async created() {
    this.fetch({ pageSize: 10, pageNum: 1 })
    this.strategyOpt = await this.getStrategyOpt() || []
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
    getStrategyOpt() {
      return new Promise((resolve, reject) => {
        this.$get('/business/cmd-strategy/getStrategyList')
          .then(r => {
            if (r.data.state === 1) {
              resolve(this.strategyOptTransform(r.data.data))
            } else {
              reject()
            }
          })
      })
    },
    strategyOptTransform(raw) {
      return raw.map(item => {
        return {
          value: item.id,
          label: item.strategyName
        }
      })
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
